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

    this.networkSettingsForm.get('wirelessSettings').get('isEnabledWireless').valueChanges.subscribe((value: boolean) => {
      if (value) {
        this.networkSettingsForm.get('wirelessSettings').get('securityKey').enable();
        this.networkSettingsForm.get('wirelessSettings').get('securityKey').setValidators([Validators.required]);

      } else {
        this.networkSettingsForm.get('wirelessSettings').get('securityKey').disable();
        this.networkSettingsForm.get('wirelessSettings').get('securityKey').reset('');
        this.networkSettingsForm.get('wirelessSettings').get('securityKey').clearValidators();

      }
      this.networkSettingsForm.get('wirelessSettings').get('securityKey').updateValueAndValidity();

    });

    this.networkSettingsForm.get('wirelessSettings').get('isEnabledWifi').valueChanges.subscribe((value: boolean) => {
      if (value) {
        this.networkSettingsForm.get('wirelessSettings').get('networkName').enable();
        this.networkSettingsForm.get('wirelessSettings').get('isEnabledWireless').enable();
        this.networkSettingsForm.get('wirelessSettings').get('ipSettings').get('isAutoIpAdress').enable();
        this.networkSettingsForm.get('wirelessSettings').get('dnsSettings').get('isAutoDnsAdress').enable();

        this.networkSettingsForm.get('wirelessSettings').get('networkName').setValidators([Validators.required]);
      } else {
        this.networkSettingsForm.get('wirelessSettings').get('networkName').disable();
        this.networkSettingsForm.get('wirelessSettings').get('isEnabledWireless').disable();
        this.networkSettingsForm.get('wirelessSettings').get('ipSettings').get('isAutoIpAdress').disable();
        this.networkSettingsForm.get('wirelessSettings').get('dnsSettings').get('isAutoDnsAdress').disable();

        this.networkSettingsForm.get('wirelessSettings').get('networkName').reset('');
        this.networkSettingsForm.get('wirelessSettings').get('isEnabledWireless').reset(false);
        this.networkSettingsForm.get('wirelessSettings').get('ipSettings').get('isAutoIpAdress').reset('true');
        this.networkSettingsForm.get('wirelessSettings').get('dnsSettings').get('isAutoDnsAdress').reset('true');

        this.networkSettingsForm.get('wirelessSettings').get('networkName').clearValidators();
      }

      this.networkSettingsForm.get('wirelessSettings').get('networkName').updateValueAndValidity();
    });

    if(!!this.networkSettings){
      this.networkSettingsForm.get('ethernetSettings').get('ipSettings').get('isAutoIpAdress').setValue(this.networkSettings.ethernetSettings.ipSettings.isAutoIpAdress);
      this.networkSettingsForm.get('ethernetSettings').get('ipSettings').get('ipAdress').setValue(this.networkSettings.ethernetSettings.ipSettings.ipAdress);
      this.networkSettingsForm.get('ethernetSettings').get('ipSettings').get('masck').setValue(this.networkSettings.ethernetSettings.ipSettings.masck);
      this.networkSettingsForm.get('ethernetSettings').get('ipSettings').get('gateway').setValue(this.networkSettings.ethernetSettings.ipSettings.gateway);
      this.networkSettingsForm.get('ethernetSettings').get('dnsSettings').get('isAutoDnsAdress').setValue(this.networkSettings.ethernetSettings.dnsSettings.isAutoDnsAdress);
      this.networkSettingsForm.get('ethernetSettings').get('dnsSettings').get('preferredDns').setValue(this.networkSettings.ethernetSettings.dnsSettings.preferredDns);
      this.networkSettingsForm.get('ethernetSettings').get('dnsSettings').get('alternativeDns').setValue(this.networkSettings.ethernetSettings.dnsSettings.alternativeDns);
  
      this.networkSettingsForm.get('wirelessSettings').get('isEnabledWifi').setValue(this.networkSettings.wirelessSettings.isEnabledWifi);
      this.networkSettingsForm.get('wirelessSettings').get('networkName').setValue(this.networkSettings.wirelessSettings.networkName);
      this.networkSettingsForm.get('wirelessSettings').get('isEnabledWireless').setValue(this.networkSettings.wirelessSettings.isEnabledWireless);
      this.networkSettingsForm.get('wirelessSettings').get('securityKey').setValue(this.networkSettings.wirelessSettings.securityKey);
      this.networkSettingsForm.get('wirelessSettings').get('ipSettings').get('isAutoIpAdress').setValue(this.networkSettings.wirelessSettings.ipSettings.isAutoIpAdress);
      this.networkSettingsForm.get('wirelessSettings').get('ipSettings').get('ipAdress').setValue(this.networkSettings.wirelessSettings.ipSettings.ipAdress);
      this.networkSettingsForm.get('wirelessSettings').get('ipSettings').get('masck').setValue(this.networkSettings.wirelessSettings.ipSettings.masck);
      this.networkSettingsForm.get('wirelessSettings').get('ipSettings').get('gateway').setValue(this.networkSettings.wirelessSettings.ipSettings.gateway);
      this.networkSettingsForm.get('wirelessSettings').get('dnsSettings').get('isAutoDnsAdress').setValue(this.networkSettings.wirelessSettings.dnsSettings.isAutoDnsAdress);
      this.networkSettingsForm.get('wirelessSettings').get('dnsSettings').get('preferredDns').setValue(this.networkSettings.wirelessSettings.dnsSettings.preferredDns);
      this.networkSettingsForm.get('wirelessSettings').get('dnsSettings').get('alternativeDns').setValue(this.networkSettings.wirelessSettings.dnsSettings.alternativeDns);
    }
  }

  private subscribeOnIpSettings(settingName: string) {
    this.networkSettingsForm.get(settingName).get('ipSettings').get('isAutoIpAdress').valueChanges.subscribe((value: string) => {
      console.log(value)
      if (value === 'false') {

        this.networkSettingsForm.get(settingName).get('ipSettings').get('ipAdress').enable();
        this.networkSettingsForm.get(settingName).get('ipSettings').get('masck').enable();
        this.networkSettingsForm.get(settingName).get('ipSettings').get('gateway').enable();

        this.networkSettingsForm.get(settingName).get('ipSettings').get('ipAdress').setValidators([Validators.required]);
        this.networkSettingsForm.get(settingName).get('ipSettings').get('masck').setValidators([Validators.required]);
        this.networkSettingsForm.get(settingName).get('ipSettings').get('gateway').setValidators([]);
      } else {
        this.networkSettingsForm.get(settingName).get('ipSettings').get('ipAdress').disable();
        this.networkSettingsForm.get(settingName).get('ipSettings').get('masck').disable();
        this.networkSettingsForm.get(settingName).get('ipSettings').get('gateway').disable();

        this.networkSettingsForm.get(settingName).get('ipSettings').get('ipAdress').reset('');
        this.networkSettingsForm.get(settingName).get('ipSettings').get('masck').reset('');
        this.networkSettingsForm.get(settingName).get('ipSettings').get('gateway').reset('');

        this.networkSettingsForm.get(settingName).get('ipSettings').get('ipAdress').clearValidators();
        this.networkSettingsForm.get(settingName).get('ipSettings').get('masck').clearValidators();
        this.networkSettingsForm.get(settingName).get('ipSettings').get('gateway').clearValidators();
      }

      this.networkSettingsForm.get(settingName).get('ipSettings').get('ipAdress').updateValueAndValidity();
      this.networkSettingsForm.get(settingName).get('ipSettings').get('masck').updateValueAndValidity();
      this.networkSettingsForm.get(settingName).get('ipSettings').get('gateway').updateValueAndValidity();
    })
  }

  private subscribeOnDnsSettings(settingName: string) {
    this.networkSettingsForm.get(settingName).get('dnsSettings').get('isAutoDnsAdress').valueChanges.subscribe((value: string) => {
      if (value === 'false') {
        console.log(value)
        this.networkSettingsForm.get(settingName).get('dnsSettings').get('preferredDns').enable();
        this.networkSettingsForm.get(settingName).get('dnsSettings').get('alternativeDns').enable();

        this.networkSettingsForm.get(settingName).get('dnsSettings').get('preferredDns').setValidators([Validators.required]);
        this.networkSettingsForm.get(settingName).get('dnsSettings').get('alternativeDns').setValidators([]);
      } else {
        this.networkSettingsForm.get(settingName).get('dnsSettings').get('preferredDns').disable();
        this.networkSettingsForm.get(settingName).get('dnsSettings').get('alternativeDns').disable();

        this.networkSettingsForm.get(settingName).get('dnsSettings').get('preferredDns').reset('');
        this.networkSettingsForm.get(settingName).get('dnsSettings').get('alternativeDns').reset('');

        this.networkSettingsForm.get(settingName).get('dnsSettings').get('preferredDns').clearValidators();
        this.networkSettingsForm.get(settingName).get('dnsSettings').get('alternativeDns').clearValidators();
      }

      this.networkSettingsForm.get(settingName).get('dnsSettings').get('preferredDns').updateValueAndValidity();
      this.networkSettingsForm.get(settingName).get('dnsSettings').get('alternativeDns').updateValueAndValidity();
    })
  }
}
