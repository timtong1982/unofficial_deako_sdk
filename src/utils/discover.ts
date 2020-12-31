import * as mdns from 'mdns';
import { Constants } from '../constants';

const sequence = [
    mdns.rst.DNSServiceResolve(),
    'DNSServiceGetAddrInfo' in mdns.dns_sd ? mdns.rst.DNSServiceGetAddrInfo() : mdns.rst.getaddrinfo({ families: [4] }),
    mdns.rst.makeAddressesUnique()
];

interface IConnectDiscoverData {
    address: string;
    port: number;
}

type FoundCallbackType = (data: IConnectDiscoverData) => void;

class DiscoverC {

    private readonly browser: mdns.Browser;

    private readonly foundCallback: FoundCallbackType;

    constructor(foundCallback: FoundCallbackType) {
        this.foundCallback = foundCallback;
        this.browser = mdns.createBrowser(mdns.tcp(Constants.serviceType), { resolverSequence: sequence })
        this.init();
    }

    onStart() {
        this.browser.start();
    }

    onStop() {
        this.browser.stop();
    }

    private init = () => {
        this.browser.on('serviceUp', this.onServiceUp);
    }

    private processServiceData = (service: mdns.Service) => {
        if (service?.name === Constants.serviceName) {
            return {
                address: service.addresses[0],
                port: service.port
            } as IConnectDiscoverData;
        }
        return null;
    }

    private onServiceUp = (service: mdns.Service) => {
        const data = this.processServiceData(service)
        if (data) {
            this.foundCallback(data);
        }
    }
}
const processServiceData = (service: mdns.Service) => {
    if (service?.name === Constants.serviceName) {
        return {
            address: service.addresses[0],
            port: service.port
        } as IConnectDiscoverData;
    }
    return null;
}

const onServiceUp = (service: mdns.Service, callback: FoundCallbackType) => {
    const data = processServiceData(service)
    if (data) {
        callback(data);
    }
}

const workerLoad = new Promise((resolve: FoundCallbackType, reject: any) => {
    const browser = mdns.createBrowser(mdns.tcp(Constants.serviceType), { resolverSequence: sequence })
    browser.on('serviceUp', (service: mdns.Service) => onServiceUp(service, resolve))
});

const timeout = new Promise((_resolve: Function, reject: (reason: any) => void) => {
    const timeoutId = setTimeout(() => {
        clearTimeout(timeoutId);
        reject('Discover timeout');
    }, Constants.discoverTimeout);
})

const Discover = new Promise((resolve: FoundCallbackType, reject: (resonse: any) => void) => {
    return Promise.race([
        workerLoad, timeout
    ])
})

Discover.then(data => console.log(data))

export {
    Discover,
    IConnectDiscoverData
}
