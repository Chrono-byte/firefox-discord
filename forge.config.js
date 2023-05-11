module.exports = {
  packagerConfig: {},
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
		// appimage
		{
			name: '@electron-forge/maker-appimage',
			config: {
				arch: 'x64',
				icon: 'src/assets/icons/icon.png',
				categories: ['Utility']
			}
		}
  ],
};
