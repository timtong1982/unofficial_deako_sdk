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
        this.browser = mdns.createBrowser(mdns.tcp(Constants.serviceName), { resolverSequence: sequence })
        this.init();
    }

    onStart() {
        this.browser.start();
    }

    onStop() {
        this.browser.stop();
    }

    private init() {
        this.browser.on('serviceUp', this.onServiceUp);
    }

    private processServiceData(service: mdns.Service) {
        if (service?.name === Constants.serviceName) {
            return {
                address: service.addresses[0],
                port: service.port
            } as IConnectDiscoverData;
        }
        return null;
    }

    private onServiceUp(service: mdns.Service) {
        const data = this.processServiceData(service)
        if (data) {
            this.foundCallback(data)
            this.onStop()
        }
    }
    private onServiceDown(service: mdns.Service) { }

    private onServiceChange(service: mdns.Service) { }
}

const Discover = new Promise((resolve: FoundCallbackType, reject) => {
    const discover = new DiscoverC(resolve);
    discover.onStart();
})
