import { ThemeConfig } from "antd";

export const antdCustomTheme = (theme: "blue" | "dark" | "light") => {

    const lightTheme :ThemeConfig = {
        token: {
            colorPrimary: "#015965",
            colorPrimaryBg: "#015965",
            colorText: "rgba(0, 0, 0, 0.85)",
            colorTextBase: "rgba(0, 0, 0, 1)",
            colorBgBase: "#fff",
            // colorBgContainer: "transparent",
            fontFamily: "Outfit",
            // borderRadius: 4,
            // borderRadiusSM: 4,
        },
        components:{
            Menu: {
                colorItemBgSelected: "transparent",
                colorIconHover: "#fff",
                colorItemTextHover: "#fff",
                // colorItemBgHover: "linear-gradient(to right, #3e63a4, #32569b, #264a93, #193d89, #0a3180)",
                colorItemBgActive: "#fff",
                colorItemTextSelected: "#f0f0f0",
                colorItemText: "#fff",
                fontSize: 14,
                // colorSubItemBg: "#0a3180",
                colorText: "red",
                colorItemBg: "transparent",
                borderRadius: 0,
            },
            Tabs: {
                // colorBgTextActive: "blue",
                // colorBgTextHover: "red"
            }
        },
    }

    const blueTheme :ThemeConfig = {
        token: {
            // colorPrimary: "#0a3180",
            // colorPrimaryBg: "#D6E4FF",
            // colorText: "#fff",
            // colorTextBase: "#fff",
            // colorBgBase: "#000",
            // colorBgContainer: "transparent",
            // fontFamily: "Outfit",
            // borderRadius: 8,
            // borderRadiusSM: 4
        }
    }
    return theme === "blue" ? blueTheme : lightTheme
}