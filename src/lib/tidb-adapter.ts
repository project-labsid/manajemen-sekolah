import { ok } from '@prisma/driver-adapter-utils'
import { connect, Connection, Tx } from '@tidbcloud/serverless'

type QueryResult = {
  columns: string[]
  rows: any[][]
  lastInsertId?: bigint
  count?: number
}

class TiDBQueryable {
  constructor(private conn: Connection | Tx) {}

  async queryRaw(params: { sql: string; args?: any[] }): Promise<QueryResult> {
    const sql = typeof params.sql === 'string' ? params.sql : String(params.sql)
    const args = (params.args ?? []) as any[]
    const result = await this.conn.execute(sql, args)

    const columns = (result.fields ?? []).map((f: any) => f.name)
    const rows = (result.rows ?? []).map((row: any) => {
      const arr: any[] = []
      columns.forEach((col: string, i: number) => { arr.push(row[i]) })
      return arr
    })

    return {
      columns,
      rows,
      lastInsertId: result.insertId != null ? BigInt(result.insertId) : undefined,
      count: result.affectedRows ?? 0,
    }
  }

  async executeRaw(params: { sql: string; args?: any[] }): Promise<QueryResult> {
    return this.queryRaw(params)
  }
}

export class TiDBCloudAdapter {
  adapterName = 'tidb-cloud-serverless'
  provider = 'mysql'
  private conn: Connection | null = null
  private url: string

  constructor(url: string) {
    this.url = url
  }

  private async getConn(): Promise<Connection> {
    if (!this.conn) {
      this.conn = connect({ url: this.url })
    }
    return this.conn
  }

  async queryRaw(params: { sql: string; args?: any[] }): Promise<QueryResult> {
    const conn = await this.getConn()
    return new TiDBQueryable(conn).queryRaw(params)
  }

  async executeRaw(params: { sql: string; args?: any[] }): Promise<QueryResult> {
    const conn = await this.getConn()
    return new TiDBQueryable(conn).executeRaw(params)
  }

  async executeScript(params: { sql: string }): Promise<void> {
    const conn = await this.getConn()
    const statements = params.sql.split(';').filter((s: string) => s.trim())
    for (const stmt of statements) {
      await conn.execute(stmt.trim(), [])
    }
  }

  async dispose(): Promise<void> {
    this.conn = null
  }

  async startTransaction(): Promise<TiDBTxAdapter> {
    const conn = await this.getConn()
    const tx = await conn.begin()
    return new TiDBTxAdapter(tx)
  }

  getConnectionInfo() {
    return ok({ schema: 'mysql' })
  }
}

class TiDBTxAdapter {
  adapterName = 'tidb-cloud-serverless'
  provider = 'mysql'
  options = {}
  private tx: Tx

  constructor(tx: Tx) {
    this.tx = tx
  }

  async queryRaw(params: { sql: string; args?: any[] }): Promise<QueryResult> {
    const q = new TiDBQueryable(this.tx)
    return q.queryRaw(params)
  }

  async executeRaw(params: { sql: string; args?: any[] }): Promise<QueryResult> {
    const q = new TiDBQueryable(this.tx)
    return q.executeRaw(params)
  }

  async commit(): Promise<void> {
    await this.tx.commit()
  }

  async rollback(): Promise<void> {
    await this.tx.rollback()
  }
}