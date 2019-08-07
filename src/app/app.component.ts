import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

export class NetworkSettings {
  ethernetSettings: EthernetSettings;
  wirelessSettings: WirelessSettings;
}

export class EthernetSettings {
  ipSettings: IpSettings;
  dnsSettings: DnsSettings;
}

export class WirelessSettings {
  isEnabledWifi: boolean;
  networkName: string;
  isEnabledWireless: boolean;
  securityKey: string;
  ipSettings: IpSettings;
  dnsSettings: DnsSettings;
}

export class IpSettings {
  isAutoIpAdress: boolean;
  ipAdress: number;
  masck: number;
  gateway: number;
}

export class DnsSettings {
  isAutoDnsAdress: boolean;
  preferredDns: number;
  alternativeDns: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

   public wirelessNames = [
    { name: 'SSID 1', id: 1 },
    { name: 'SSID 2', id: 2 },
    { name: 'SSID 3', id: 3 },
  ];

  public networkSettingsForm: FormGroup;

  private networkSettings: NetworkSettings;

  constructor(private formBuilder: FormBuilder) {

  }

  submit() {

    if (this.networkSettingsForm.invalid) {
      return;
    }

    localStorage.setItem('networkSettings', JSON.stringify(this.networkSettingsForm.getRawValue()));

    console.log(this.networkSettingsForm.value);

  }

  ngOnInit() {

    this.networkSettings = JSON.parse(localStorage.getItem('networkSettings'));

    this.networkSettingsForm = this.formBuilder.group({
      ethernetSettings: this.formBuilder.group({
        ipSettings: this.formBuilder.group({
          isAutoIpAdress: ['true'],
          ipAdress: [{ value: '', disabled: true }],
          masck: [{ value: '', disabled: true }],
          gateway: [{ value: '', disabled: true }],
        }),
        dnsSettings: this.formBuilder.group({
          isAutoDnsAdress: ['true'],
          preferredDns: [{ value: '', disabled: true }],
          alternativeDns: [{ value: '', disabled: true }],
        }),
      }),
      wirelessSettings: this.formBuilder.group({
        isEnabledWifi: [false],
        networkName: [{ value: '', disabled: true }],
        isEnabledWireless: [{ value: false, disabled: true }],
        securityKey: [{ value: '', disabled: true }],
        ipSettings: this.formBuilder.group({
          isAutoIpAdress: [{ value: 'true', disabled: true }],
          ipAdress: [{ value: '', disabled: true }],
          masck: [{ value: '', disabled: true }],
          gateway: [{ value: '', disabled: true }],
        }),
        dnsSettings: this.formBuilder.group({
          isAutoDnsAdress: [{ value: 'true', disabled: true }],
          preferredDns: [{ value: '', disabled: true }],
          alternativeDns: [{ value: '', disabled: true }],
        }),
      })
    });

    this.subscribeOnIpSettings('ethernetSettings');
    this.subscribeOnIpSettings('wirelessSettings');

    this.subscribeOnDnsSettings('ethernetSettings');
    this.subscribeOnDnsSettings('wirelessSettings');

    const getWirelessSettings = this.networkSettingsForm.get('wirelessSettings');
    const getEthernetSettings = this.networkSettingsForm.get('ethernetSettings');

    getWirelessSettings.get('isEnabledWireless').valueChanges.subscribe((value: boolean) => {
      if (value) {
        getWirelessSettings.get('securityKey').enable();
        getWirelessSettings.get('securityKey').setValidators([Validators.required]);

      } else {
        getWirelessSettings.get('securityKey').disable();
        getWirelessSettings.get('securityKey').reset('');
        getWirelessSettings.get('securityKey').clearValidators();

      }
      getWirelessSettings.get('securityKey').updateValueAndValidity();

    });

    getWirelessSettings.get('isEnabledWifi').valueChanges.subscribe((value: boolean) => {
      if (value) {
        getWirelessSettings.get('networkName').enable();
        getWirelessSettings.get('isEnabledWireless').enable();
        getWirelessSettings.get('ipSettings').get('isAutoIpAdress').enable();
        getWirelessSettings.get('dnsSettings').get('isAutoDnsAdress').enable();

        getWirelessSettings.get('networkName').setValidators([Validators.required]);
      } else {
        getWirelessSettings.get('networkName').disable();
        getWirelessSettings.get('isEnabledWireless').disable();
        getWirelessSettings.get('ipSettings').get('isAutoIpAdress').disable();
        getWirelessSettings.get('dnsSettings').get('isAutoDnsAdress').disable();

        getWirelessSettings.get('networkName').reset('');
        getWirelessSettings.get('isEnabledWireless').reset(false);
        getWirelessSettings.get('ipSettings').get('isAutoIpAdress').reset('true');
        getWirelessSettings.get('dnsSettings').get('isAutoDnsAdress').reset('true');

        getWirelessSettings.get('networkName').clearValidators();
      }

      getWirelessSettings.get('networkName').updateValueAndValidity();
    });

    if(!!this.networkSettings){
      getEthernetSettings.get('ipSettings').get('isAutoIpAdress').setValue(this.networkSettings.ethernetSettings.ipSettings.isAutoIpAdress);
      getEthernetSettings.get('ipSettings').get('ipAdress').setValue(this.networkSettings.ethernetSettings.ipSettings.ipAdress);
      getEthernetSettings.get('ipSettings').get('masck').setValue(this.networkSettings.ethernetSettings.ipSettings.masck);
      getEthernetSettings.get('ipSettings').get('gateway').setValue(this.networkSettings.ethernetSettings.ipSettings.gateway);
      getEthernetSettings.get('dnsSettings').get('isAutoDnsAdress').setValue(this.networkSettings.ethernetSettings.dnsSettings.isAutoDnsAdress);
      getEthernetSettings.get('dnsSettings').get('preferredDns').setValue(this.networkSettings.ethernetSettings.dnsSettings.preferredDns);
      getEthernetSettings.get('dnsSettings').get('alternativeDns').setValue(this.networkSettings.ethernetSettings.dnsSettings.alternativeDns);
  
      getWirelessSettings.get('isEnabledWifi').setValue(this.networkSettings.wirelessSettings.isEnabledWifi);
      getWirelessSettings.get('networkName').setValue(this.networkSettings.wirelessSettings.networkName);
      getWirelessSettings.get('isEnabledWireless').setValue(this.networkSettings.wirelessSettings.isEnabledWireless);
      getWirelessSettings.get('securityKey').setValue(this.networkSettings.wirelessSettings.securityKey);
      getWirelessSettings.get('ipSettings').get('isAutoIpAdress').setValue(this.networkSettings.wirelessSettings.ipSettings.isAutoIpAdress);
      getWirelessSettings.get('ipSettings').get('ipAdress').setValue(this.networkSettings.wirelessSettings.ipSettings.ipAdress);
      getWirelessSettings.get('ipSettings').get('masck').setValue(this.networkSettings.wirelessSettings.ipSettings.masck);
      getWirelessSettings.get('ipSettings').get('gateway').setValue(this.networkSettings.wirelessSettings.ipSettings.gateway);
      getWirelessSettings.get('dnsSettings').get('isAutoDnsAdress').setValue(this.networkSettings.wirelessSettings.dnsSettings.isAutoDnsAdress);
      getWirelessSettings.get('dnsSettings').get('preferredDns').setValue(this.networkSettings.wirelessSettings.dnsSettings.preferredDns);
      getWirelessSettings.get('dnsSettings').get('alternativeDns').setValue(this.networkSettings.wirelessSettings.dnsSettings.alternativeDns);
    }
  }

  private subscribeOnIpSettings(settingName: string) {
    const getIpSettings = this.networkSettingsForm.get(settingName).get('ipSettings');
    getIpSettings.get('isAutoIpAdress').valueChanges.subscribe((value: string) => {
      console.log(value)
      if (value === 'false') {

        getIpSettings.get('ipAdress').enable();
        getIpSettings.get('masck').enable();
        getIpSettings.get('gateway').enable();

        getIpSettings.get('ipAdress').setValidators([Validators.required]);
        getIpSettings.get('masck').setValidators([Validators.required]);
        getIpSettings.get('gateway').setValidators([]);
      } else {
        getIpSettings.get('ipAdress').disable();
        getIpSettings.get('masck').disable();
        getIpSettings.get('gateway').disable();

        getIpSettings.get('ipAdress').reset('');
        getIpSettings.get('masck').reset('');
        getIpSettings.get('gateway').reset('');

        getIpSettings.get('ipAdress').clearValidators();
        getIpSettings.get('masck').clearValidators();
        getIpSettings.get('gateway').clearValidators();
      }

      getIpSettings.get('ipAdress').updateValueAndValidity();
      getIpSettings.get('masck').updateValueAndValidity();
      getIpSettings.get('gateway').updateValueAndValidity();
    })
  }

  private subscribeOnDnsSettings(settingName: string) {
    const getDnsSettings = this.networkSettingsForm.get(settingName).get('dnsSettings');
    getDnsSettings.get('isAutoDnsAdress').valueChanges.subscribe((value: string) => {
      if (value === 'false') {
        console.log(value)
        getDnsSettings.get('preferredDns').enable();
        getDnsSettings.get('alternativeDns').enable();

        getDnsSettings.get('preferredDns').setValidators([Validators.required]);
        getDnsSettings.get('alternativeDns').setValidators([]);
      } else {
        getDnsSettings.get('preferredDns').disable();
        getDnsSettings.get('alternativeDns').disable();

        getDnsSettings.get('preferredDns').reset('');
        getDnsSettings.get('alternativeDns').reset('');

        getDnsSettings.get('preferredDns').clearValidators();
        getDnsSettings.get('alternativeDns').clearValidators();
      }

      getDnsSettings.get('preferredDns').updateValueAndValidity();
      getDnsSettings.get('alternativeDns').updateValueAndValidity();
    })
  }
}