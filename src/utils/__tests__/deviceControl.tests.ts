import { DeviceControl } from '../deviceControl';

describe('Disover class test', () => {
    let dev: DeviceControl;
    beforeAll(() => {
        dev = new DeviceControl();
    }, 2000)

    it('List devices', () => {
        dev.listDevices();
    })
})
