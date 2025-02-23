import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'AWS Management Console Login Helper',
    description: 'この拡張機能はAWS Management Consoleのログイン情報の入力を支援します',
    version: '0.0.2',
    manifest_version: 3,
    permissions: [
      'tabs',
      'activeTab'
    ],
    action: {
      default_popup: './popup/index.html',
    },
  }
});
