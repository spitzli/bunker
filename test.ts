import { transform } from "https://deno.land/x/aleph_compiler@0.5.5/mod.ts";

const code = `
import { useState, useEffect } from "react"

export default App() {
  const [msg, setMsg] = useState("...")

  useEffect(() => {
    setTimeout(() => {
      setMsg("world!")
    }, 1000)
  }, [])

  return <h1>Hello {msg}</h1>
}
`

const ret = await transform("./app.tsx", code, {
  importMap: {
    imports: {
      "react": "https://esm.sh/react@18",
    }
  }
  jsxImportSource: "https://esm.sh/react@18",
  isDev: true
})

console.log(ret.code, ret.map)