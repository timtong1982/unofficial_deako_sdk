import { IClientConfig } from '../model/common';
import { Discover } from './discover';
import * as net from 'net';


class DeviceControl {
    private clientConfig: IClientConfig | null = null;
    private readonly client: net.Socket | null = null;

    constructor() {
        this.client = new net.Socket();
        this.initDiscover();
        this.clientConfig = {
            address: '192.168.1.229',
            port: 23
        }
    }

    private initDiscover = (): void => {
        // try {
        //     const data = await Discover()
        //     this.clientConfig = {
        //         address: data.address,
        //         port: data.port
        //     }
        // }
        // catch {
        //     console.error('Hub discover failed')
        // }
    }

    private requester = () => {
        const payload = {
            transactionId: '015c44d3-abec-4be0-bb0d-34adb4b81559',
            type: 'DEVICE_LIST',
            dst: 'deako',
            src: 'ACME Corp',
        };

        if (this.clientConfig) {
            this.client?.connect(
                this.clientConfig.port!,
                this.clientConfig.address!, () => {
                    console.log('Connected');
                    this.client?.write(JSON.stringify(payload));
                }
            );

            this.client?.on('data', (data) => {
                console.log('Received: ' + data);
                this.client!.destroy();
            })

            this.client!.on('close', function () {
                console.log('Connection closed');
            });
        }
    }

    listDevices = () => {
        this.requester();
    }
}

const dev = new DeviceControl()
dev.listDevices(); 0

export {
    DeviceControl
}
