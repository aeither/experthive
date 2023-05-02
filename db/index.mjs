import { Polybase } from '@polybase/client'
import { POLYBASE_SCHEMA } from './schema.mjs'

const main = async () => {
  const db = new Polybase({
    defaultNamespace: 'nowknown0123',
  })

  const res = await db.applySchema(POLYBASE_SCHEMA)
  console.log('🚀 ~ file: schema.mjs:58 ~ applySchema ~ res:', res)

  return
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
