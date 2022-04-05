import React from "react";
import { Button, Text, View } from "react-native";
import { BluetoothDevice } from "react-native-bluetooth-classic";
import {
  GestureHandlerRootView,
  PanGestureHandler
} from "react-native-gesture-handler";
import * as S from "./styles";

interface DashboardProps {
  devices: BluetoothDevice[];
  discoveryOn: boolean;
  connectToDevice: (device: BluetoothDevice) => () => Promise<void>;
  startDiscovery: () => void;
  stopDiscovery: () => void;
  sendGestureData: (event: {
    nativeEvent: {
      x: number;
      y: number;
    };
  }) => Promise<void>;
}

export const Dashboard = ({
  devices,
  discoveryOn,
  stopDiscovery,
  startDiscovery,
  connectToDevice,
  sendGestureData,
}: DashboardProps) => {
  return (
    <View>
      <Text>Dispositivos:</Text>
      <Button
        onPress={() => (discoveryOn ? stopDiscovery() : startDiscovery())}
        title={`Scan ${discoveryOn ? "(On)" : "(Off)"}`}
      />
      {devices &&
        devices.map((device) => (
          <Button
            key={device.address}
            onPress={connectToDevice(device)}
            title={`${device.name} ${device.address}`}
          />
        ))}
      <S.ContainerAnalogStick>
        <GestureHandlerRootView>
          <PanGestureHandler onGestureEvent={sendGestureData}>
            <S.AnalogStick />
          </PanGestureHandler>
        </GestureHandlerRootView>
      </S.ContainerAnalogStick>
    </View>
  );
};

{
  /* <Button
        onPress={() => {
          const data = JSON.stringify({ velocidade: 32, direcao: 0 });
          writeToDevice(data);
        }}
        title={"Min"}
      />
      <Button
        onPress={() => {
          const data = JSON.stringify({ velocidade: 32, direcao: 90 });
          writeToDevice(data);
        }}
        title={"Mid"}
      />
      <Button
        onPress={() => {
          const data = JSON.stringify({ velocidade: 32, direcao: 180 });
          writeToDevice(data);
        }}
        title={"Max"}
      /> */
}
