import React, { useEffect, useState } from "react";
import RNBluetoothClassic, {
  BluetoothDevice
} from "react-native-bluetooth-classic";
import { BluetoothEventSubscription } from "react-native-bluetooth-classic/lib/BluetoothEvent";
import { Dashboard } from "../components/Dashboard";

export default function DashboardScreen() {
  const [discoveryOn, setDiscovery] = useState<boolean>(false);
  const [devices, setDevices] = useState<BluetoothDevice[]>();
  const [device, setDevice] = useState<BluetoothDevice>();
  const [enabledSubscription, setEnabledSubscription] =
    useState<BluetoothEventSubscription>();
  const [disabledSubscription, setDisabledSubscription] =
    useState<BluetoothEventSubscription>();
  const [bluetoothEnabled, setBluetoothEnabled] = useState<boolean>();
  const [allowWrite, setAllowWrite] = useState<boolean>(true);

  const checkBluetootEnabled = async () => {
    try {
      console.log("Checking bluetooth status");
      let enabled = await RNBluetoothClassic.isBluetoothEnabled();

      console.log(`Status: enabled = ${enabled}`);
      setBluetoothEnabled(enabled);

      startDiscovery();
    } catch (error) {
      console.log("Status Error: ", error);
      setBluetoothEnabled(false);
    }
  };

  const writeToDevice = async (jsonData: string) => {
    if (allowWrite)
      try {
        setAllowWrite(false);
        const message = JSON.stringify(jsonData);
        const treatedMessage = message.substring(1, message.length - 1);
        console.log(treatedMessage);
        await device.write(treatedMessage);
      } catch (error) {
        console.log(error);
      } finally {
        setTimeout(function () {
          setAllowWrite(true);
        }, 80);
      }
  };

  const connectToDevice = (device: BluetoothDevice) => async () => {
    if (device)
      try {
        console.log("Trying connection.", device.name, device.address);
        const connected = await device.connect();
        console.log("Connected to device: ", connected);
        setDevice(device);
      } catch (error) {
        console.log(error);
      }
  };

  const stopDiscovery = async () => {
    if (discoveryOn)
      try {
        RNBluetoothClassic.cancelDiscovery();
      } catch (error) {
        console.log("Cancel discovery Error: ", error);
        setBluetoothEnabled(false);
      } finally {
        setDiscovery(false);
      }
  };

  const startDiscovery = async () => {
    const discoveryOff = !discoveryOn;
    if (discoveryOff)
      try {
        setDiscovery(true);
        const devices = await RNBluetoothClassic.startDiscovery();
        RNBluetoothClassic.cancelDiscovery();
        setDevices(devices);
      } catch (error) {
        console.log("Discovery Error: ", error);
        setBluetoothEnabled(false);
      } finally {
        setDiscovery(false);
      }
  };

  const onStateChanged = (stateChangedEvent) => {
    console.log("Event used for onBluetoothEnabled and onBluetoothDisabled");
    // setState({
    //   bluetoothEnabled: stateChangedEvent.enabled,
    //   device: stateChangedEvent.enabled ? state.device : undefined,
    // });
  };

  useEffect(() => {
    // setEnabledSubscription(
    //   RNBluetoothClassic.onBluetoothEnabled((event) => onStateChanged(event))
    // );
    // setDisabledSubscription(
    //   RNBluetoothClassic.onBluetoothDisabled((event) => onStateChanged(event))
    // );

    checkBluetootEnabled();

    // setInterval(() => {
    //   writeToDevice(status);
    // }, 1000);

    return () => {
      // console.log(
      //   "App:componentWillUnmount removing subscriptions: enabled and distabled"
      // );
      // console.log(
      //   "App:componentWillUnmount alternatively could have used stateChanged"
      // );
      // enabledSubscription.remove();
      // disabledSubscription.remove();
    };
  }, []);

  const sendGestureData = async (event: {
    nativeEvent: { x: number; y: number };
  }) => {
    setAllowWrite(false);
    const speed = -event.nativeEvent.y;
    const direction = event.nativeEvent.x / 2;
    const data = {
      velocidade: speed,
      direcao: direction > 90 ? 180 : direction < -90 ? 0 : direction + 90,
    };
    const jsonData = JSON.stringify(data);
    await writeToDevice(jsonData);
  };

  return (
    <Dashboard
      devices={devices}
      discoveryOn={discoveryOn}
      connectToDevice={connectToDevice}
      startDiscovery={startDiscovery}
      stopDiscovery={stopDiscovery}
      sendGestureData={sendGestureData}
    />
  );
}
