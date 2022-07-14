
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
            }

          ]
        },
        win:{
          target: [
            {
              target: "zip",
              arch: ["x64"]
            },
            {
              target: "portable",
              arch: ["x64"]
            }
          ],
          icon: 'build/icons/icon.ico',
        },
        artifactName:'${productName}-${os}-${version}.${ext}',
        extraFiles: {
          from: "./extra/win/",
          to: "./",
        },
      }
    }
  }
}
