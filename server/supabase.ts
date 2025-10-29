export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
    // Allows to automatically instantiate createClient with right options
    // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
    __InternalSupabase: {
        PostgrestVersion: '13.0.5'
    }
    public: {
        Tables: {
            ai_chat_messages: {
                Row: {
                    chat_id: number
                    id: string
                    submitted_by: string | null
                    submitter: Database['public']['Enums']['ai_chat_submitters']
                    text: string
                }
                Insert: {
                    chat_id: number
                    id?: string
                    submitted_by?: string | null
                    submitter: Database['public']['Enums']['ai_chat_submitters']
                    text: string
                }
                Update: {
                    chat_id?: number
                    id?: string
                    submitted_by?: string | null
                    submitter?: Database['public']['Enums']['ai_chat_submitters']
                    text?: string
                }
                Relationships: [
                    {
                        foreignKeyName: 'ai_chat_messages_chat_id_fkey'
                        columns: ['chat_id']
                        isOneToOne: false
                        referencedRelation: 'chat_rooms'
                        referencedColumns: ['id']
                    },
                    {
                        foreignKeyName: 'ai_chat_messages_submitted_by_fkey'
                        columns: ['submitted_by']
                        isOneToOne: false
                        referencedRelation: 'profiles'
                        referencedColumns: ['id']
                    }
                ]
            }
            chat_messages: {
                Row: {
                    chat_room: number
                    id: string
                    modified_at: string | null
                    submitted_at: string
                    submitted_by: string
                    text: string
                }
                Insert: {
                    chat_room: number
                    id?: string
                    modified_at?: string | null
                    submitted_at?: string
                    submitted_by?: string
                    text: string
                }
                Update: {
                    chat_room?: number
                    id?: string
                    modified_at?: string | null
                    submitted_at?: string
                    submitted_by?: string
                    text?: string
                }
                Relationships: [
                    {
                        foreignKeyName: 'chat_messages_chat_room_fkey'
                        columns: ['chat_room']
                        isOneToOne: false
                        referencedRelation: 'chat_rooms'
                        referencedColumns: ['id']
                    },
                    {
                        foreignKeyName: 'chat_messages_submitted_by_fkey'
                        columns: ['submitted_by']
                        isOneToOne: false
                        referencedRelation: 'profiles'
                        referencedColumns: ['id']
                    }
                ]
            }
            chat_rooms: {
                Row: {
                    description: string | null
                    id: number
                    name: string
                    type: Database['public']['Enums']['chat_type']
                }
                Insert: {
                    description?: string | null
                    id?: number
                    name: string
                    type?: Database['public']['Enums']['chat_type']
                }
                Update: {
                    description?: string | null
                    id?: number
                    name?: string
                    type?: Database['public']['Enums']['chat_type']
                }
                Relationships: []
            }
            profiles: {
                Row: {
                    avatar_url: string | null
                    id: string
                    name: string
                }
                Insert: {
                    avatar_url?: string | null
                    id: string
                    name: string
                }
                Update: {
                    avatar_url?: string | null
                    id?: string
                    name?: string
                }
                Relationships: []
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            ai_chat_submitters: 'model' | 'user'
            chat_type: 'default' | 'AI'
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
    DefaultSchemaTableNameOrOptions extends
        | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
        | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
        ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
              DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
        : never = never
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
          DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
          Row: infer R
      }
        ? R
        : never
    : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
            DefaultSchema['Views'])
      ? (DefaultSchema['Tables'] &
            DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
            Row: infer R
        }
          ? R
          : never
      : never

export type TablesInsert<
    DefaultSchemaTableNameOrOptions extends
        | keyof DefaultSchema['Tables']
        | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
        ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
        : never = never
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
          Insert: infer I
      }
        ? I
        : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
      ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
            Insert: infer I
        }
          ? I
          : never
      : never

export type TablesUpdate<
    DefaultSchemaTableNameOrOptions extends
        | keyof DefaultSchema['Tables']
        | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
        ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
        : never = never
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
          Update: infer U
      }
        ? U
        : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
      ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
            Update: infer U
        }
          ? U
          : never
      : never

export type Enums<
    DefaultSchemaEnumNameOrOptions extends
        | keyof DefaultSchema['Enums']
        | { schema: keyof DatabaseWithoutInternals },
    EnumName extends DefaultSchemaEnumNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
        ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
        : never = never
> = DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
    : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
      ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
      : never

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
        | keyof DefaultSchema['CompositeTypes']
        | { schema: keyof DatabaseWithoutInternals },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
        ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
        : never = never
> = PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
      ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
      : never

export const Constants = {
    public: {
        Enums: {
            ai_chat_submitters: ['model', 'user'],
            chat_type: ['default', 'AI']
        }
    }
} as const
