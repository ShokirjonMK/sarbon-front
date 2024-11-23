import dayjs from "dayjs";

export const dateParserToDatePicker = (second: number | undefined) => dayjs((new Date(Number(second)*1000))).format('DD-MM-YYYY HH:mm');


