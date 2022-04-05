import { View } from "react-native";
import styled from "styled-components";

export const ContainerAnalogStick = styled(View)`
  border-radius: 250px;
  width: 280px;
  height: 280px;
  margin-top: 180px;
  margin-left: auto;
  margin-right: auto;
  background-color: #aaa;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const AnalogStick = styled(View)`
  border-radius: 50px;
  width: 50px;
  height: 50px;
  background-color: #000;
`;
