/**
 * Patches os.networkInterfaces() to return {} instead of throwing/hanging
 * when macOS denies Local Network access (uv_interface_addresses EPERM).
 * Storybook calls this after the server starts to display the "Network:" URL.
 */
import os from 'os';

const original = os.networkInterfaces.bind(os);

os.networkInterfaces = function patchedNetworkInterfaces() {
  try {
    return original();
  } catch {
    return {};
  }
};
