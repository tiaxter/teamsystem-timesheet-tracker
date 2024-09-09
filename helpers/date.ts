import dayjs from 'dayjs';
import {DATE_FORMAT} from "../constants";

export function validate(data: string | null | undefined) {
    return dayjs(data, DATE_FORMAT).isValid();
}