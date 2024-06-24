import { Inter } from "next/font/google";
import { Interface } from "readline";

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_num: string;
    is_admin: string;
    is_active: string;
    is_verified: string;
    email_verified_at: string | null;
    avatar: string | null;
    id_card: string;
    created_at: string;
    updated_at: string;
    country_id: string;
    is_2fa_active: string;
}

export interface Fee {
    id: number;
    min_amount: string;
    max_amount: string;
    payin_fee: string;
    payout_fee: string;
    w_provider_id: string;
    user_id: string;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
    user: User;
}

export interface Country {
    id: number;
    slug: string;
    code: string;
    country_code: string;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface WProvider {
    id: number;
    name: string;
    withdraw_mode: string;
    sending_mode: string;
    logo: string | null;
    country_id: string;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
    with_otp: string;
    fees: Fee[];
    country: Country;
}
