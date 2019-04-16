import { Permissions } from 'expo';

const permissions = {

  async cameraPermission(callback) {
    try {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      this.setState({ hasCameraPermission: status === 'granted' });
      callback();
    } catch (error) {
      console.log(`Permission Error: ${error.message}`);
    }
  },

  async cameraRollPermission(callback) {
    try {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      this.setState({ hasCameraRollPermission: status === 'granted' });
      callback();
    } catch (error) {
      console.log(`Permission Error: ${error.message}`);
    }
  },
};

export default permissions;
