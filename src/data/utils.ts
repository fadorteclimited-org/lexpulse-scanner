import axios from "axios";
import { countries } from "country-data";

export const common = {
    baseUrl: import.meta.env.VITE_API_HOST_URL,
}

export function getRandomInt(max: number, min: number = 0): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export const getAbbreviation = (num: number): string => {
    if (num === 1 || num === 21 || num === 31) {
        return num.toString() + 'st';
    } else {
        return num.toString() + 'th';
    }
}

export const monthString = (num: number): string => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return months[num];
}

export const monthStringShort = (num: number): string => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months[num];
}

export const monthInt = (month: string): number => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let finalIndex = 0;
    for (let index = 0; index < months.length; index++) {
        if (months[index].toLocaleLowerCase() === month.toLocaleLowerCase()) {
            finalIndex = index;
            break;
        }
    }
    return finalIndex;
}

export const dayStringShort = (num: number): string => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[num];
}

interface DateReaderOptions {
    date: string | Date;
    month?: boolean;
    years?: boolean;
    weekDay?: boolean;
}

export const dateReader = ({ date, month = true, years = true, weekDay = false }: DateReaderOptions): string => {
    const _date = new Date(date);
    let dateString = '';

    if (weekDay) {
        dateString = dateString.concat(dayStringShort(_date.getDay()), ' ');
    }

    dateString = dateString.concat(_date.getDate().toString(), ' ');

    if (month) {
        dateString = dateString.concat(monthStringShort(_date.getMonth()), ' ');
    }

    if (years) {
        dateString = dateString.concat(_date.getFullYear().toString());
    }

    return dateString;
}

export async function getCountry(): Promise<string> {
    const { data } = await axios.get('https://api.country.is');
    console.log(data.country);
    return countries[data.country].name;
}

export function serviceCountries(): string[] {
    const list = ['KE', 'GH', 'UK', 'CY'];
    return list.map((e) => countries[e].name);
}

export async function createFile({url, name = 'image'}: { url: string, name?: string }) {
    const response = await fetch(url);
    const data = await response.blob();
    const metadata = {
        type: 'image/jpeg'
    };
    // ... do something with the file or return it
    return new File([data], `${name}.jpg`, metadata);
}