export default {
	expo: {
		name: "CookAI",
		slug: "cookai",
		scheme: "CookAI",
		owner: "kenzei",
		version: "1.0.0",
		orientation: "portrait",
		icon: "./assets/icon.png",
		userInterfaceStyle: "light",
		splash: {
			image: "./assets/splash.png",
			resizeMode: "contain",
			backgroundColor: "#ffffff",
		},
		assetBundlePatterns: ["**/*"],
		ios: {
			supportsTablet: true,
			bundleIdentifier: "com.cookaitest.cookaiapptest",
			googleServicesFile: process.env.GOOGLE_SERVICES_INFOPLIST,
		},
		android: {
			adaptiveIcon: {
				foregroundImage: "./assets/adaptive-icon.png",
				backgroundColor: "#ffffff",
			},
			package: "com.cookaitest.cookaiapptest",
			googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
		},
		web: {
			favicon: "./assets/favicon.png",
		},
		plugins: [
			"expo-router",
			"@react-native-google-signin/google-signin",
			"expo-build-properties",
			[
				"expo-build-properties",
				{
					android: {
						compileSdkVersion: 33,
						targetSdkVersion: 33,
						buildToolsVersion: "33.0.0",
					},
					ios: {
						deploymentTarget: "15.0",
					},
				},
			],
		],
		extra: {
			router: {
				origin: false,
			},
			eas: {
				projectId: "5c3afa4d-dd3c-4ec7-bd31-abd733904a0d",
			},
		},
	},
};