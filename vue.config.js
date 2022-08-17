
module.exports ={
  pluginOptions:{
    electronBuilder:{
      nodeIntegration: true,
      builderOptions:{
        appId:'net.xianYun.EasyEnv',
        productName:'EasyEnv',
        mac:{
          target:[
            {
              target: 'dmg',
              arch:['x64'],
            },
          ],
          extraFiles: {
            from: "./extra/darwin/",
            to: "./",
          },
          icon: 'build/icons/icon.icns',
        },
        win:{
          target: [
            {
              target: "zip",
              arch: ["x64"]
            },
          ],
          extraFiles: {
            from: "./extra/win32/",
            to: "./",
          },
          icon: 'build/icons/icon.ico',
        },
        artifactName:'${productName}-${version}-${arch}.${ext}',

      }
    }
  }
}
