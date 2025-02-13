import { Image, Pressable, Text, View } from "react-native"
import { ButtonContainer } from "./ButtonContainer"
import { COLORS } from "../styles/themes"
import { useState } from "react";
import { ImagerHanlde } from "../utils/ImageProvider";

export const SimSlectionModel = ({
    onSelectItem,
    onModelHandle
}) => {
    const [ModelItem, setModelItem] = useState(onSelectItem || '');

    return (
        <View style={{
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            flex: 1,
            height: '110%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1,
        }}>

            <View style={{ width: '90%', height: '30%', backgroundColor: COLORS.White, borderRadius: 10, paddingHorizontal: 10 }}>
                <Text style={{ fontSize: 24, color: COLORS.Black, marginTop: 10,  marginBottom: 40, textAlign: 'center' }}>{"Select SIM Slot"}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20, marginBottom: 10 }}>
                    <Pressable onPress={() => setModelItem("SIM 1")}>
                        <Image source={ImagerHanlde.CallIcon.sim1_icon} resizeMode="contain" style={{ width: 100, height: 100, tintColor: ModelItem === 'SIM 1' ? COLORS.Blue : COLORS.Black }} />
                    </Pressable>
                    <Pressable onPress={() => setModelItem("SIM 2")}>
                        <Image source={ImagerHanlde.CallIcon.sim2_icon} resizeMode="contain" style={{ width: 100, height: 100, tintColor: ModelItem === 'SIM 2' ? COLORS.Blue : COLORS.Black }} />
                    </Pressable>
                </View>

                <ButtonContainer
                    TextColor={COLORS.White}
                    textValue={'Submit'}
                    top={30}
                    bottom={20}
                    bgColor={ModelItem === "" ? COLORS.LightGray : COLORS.Blue}
                    borderColour={ModelItem === "" ? COLORS.LightGray : COLORS.Blue}
                    onClick={() => onModelHandle(ModelItem)}
                />

            </View>

        </View>
    )

}