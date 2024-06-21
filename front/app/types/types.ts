import { Inter } from "next/font/google";
import { Interface } from "readline";

export interface Country  {
        code: string;         
        country_code: string; 
        created_at: string;   
        deleted_at: string | null;
        id: number;           
        slug: string;         
        updated_at: string;   
}