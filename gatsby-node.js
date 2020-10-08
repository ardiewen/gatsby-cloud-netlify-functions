/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/node-apis/
 */

// You can delete this file if you're not using it
// const glob = require("glob")
const path = require("path")
const fs = require("fs")
// const util = require("util")
// const exec = util.promisify(require("child_process").exec)

const { zipFunctions } = require("@netlify/zip-it-and-ship-it")

exports.onPostBuild = async () => {
  const srcLocation = path.join(__dirname, `./src/functions`)
  const outputLocation = path.join(__dirname, `./public/functions`)

  if (!fs.existsSync(outputLocation)) {
    fs.mkdirSync(outputLocation)
  }

  return zipFunctions(srcLocation, outputLocation)
}

// exports.onPostBuild = async () => {
//   const buildFunctions = async () => {
//     // NOTE: the gatsby build process automatically copies /static/functions to /public/functions
//     const { stdout, stderr } = await exec(
//       "cd ./public/functions && yarn install"
//     )
//     if (stderr) {
//       console.log(`stderr: ${stderr}`)
//       return
//     }
//     if (stdout) {
//       console.log(`stdout: ${stdout}`)
//     }
//   }
//   await buildFunctions()
// }

// const util = require("util")
// const exec = util.promisify(require("child_process").exec)

// const buildFunctions = async () => {
//   const { stdout, stderr } = await exec("yarn run lambda")
//   if (stderr) {
//     console.log(`stderr: ${stderr}`)
//     return
//   }
//   if (stdout) {
//     console.log(`stdout: ${stdout}`)
//   }
// }

// exports.onPostBuild = async () => {
//   await buildFunctions()
// }

// exports.onPostBuild = () => {
//   // Configure where the functions are kept and where we want to move them.
//   const srcLocation = `${__dirname}/src/functions`
//   const outputLocation = `${__dirname}/public/functions`

//   if (!fs.existsSync(outputLocation)) {
//     fs.mkdirSync(outputLocation)
//   }

//   // Get all the functions.
//   const modules = glob.sync("*.js", { cwd: srcLocation })
//   modules.forEach(src => {
//     const moduleSrc = path.join(srcLocation, src)
//     const moduleOut = path.join(
//       outputLocation,
//       path.basename(src, path.extname(src)) + ".js"
//     )

//     // Copy file to new location.
//     fs.copyFile(moduleSrc, moduleOut, err => {
//       if (err) {
//         throw err
//       }
//     })
//   })
// }
