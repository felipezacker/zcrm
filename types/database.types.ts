export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      activities: {
        Row: {
          client_company_id: string | null
          completed: boolean | null
          contact_id: string | null
          created_at: string | null
          datacrazy_id: string | null
          date: string
          deal_id: string | null
          deleted_at: string | null
          description: string | null
          end_date: string | null
          id: string
          metadata: Json | null
          notes: string | null
          organization_id: string | null
          owner_id: string | null
          participant_contact_ids: string[] | null
          title: string
          type: string
        }
        Insert: {
          client_company_id?: string | null
          completed?: boolean | null
          contact_id?: string | null
          created_at?: string | null
          datacrazy_id?: string | null
          date: string
          deal_id?: string | null
          deleted_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          organization_id?: string | null
          owner_id?: string | null
          participant_contact_ids?: string[] | null
          title: string
          type: string
        }
        Update: {
          client_company_id?: string | null
          completed?: boolean | null
          contact_id?: string | null
          created_at?: string | null
          datacrazy_id?: string | null
          date?: string
          deal_id?: string | null
          deleted_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          organization_id?: string | null
          owner_id?: string | null
          participant_contact_ids?: string[] | null
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "activities_client_company_id_fkey"
            columns: ["client_company_id"]
            isOneToOne: false
            referencedRelation: "crm_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_audio_notes: {
        Row: {
          activity_created_id: string | null
          audio_url: string | null
          contact_id: string | null
          created_at: string | null
          deal_id: string | null
          duration_seconds: number | null
          id: string
          next_action: Json | null
          sentiment: string | null
          transcription: string
          user_id: string | null
        }
        Insert: {
          activity_created_id?: string | null
          audio_url?: string | null
          contact_id?: string | null
          created_at?: string | null
          deal_id?: string | null
          duration_seconds?: number | null
          id?: string
          next_action?: Json | null
          sentiment?: string | null
          transcription: string
          user_id?: string | null
        }
        Update: {
          activity_created_id?: string | null
          audio_url?: string | null
          contact_id?: string | null
          created_at?: string | null
          deal_id?: string | null
          duration_seconds?: number | null
          id?: string
          next_action?: Json | null
          sentiment?: string | null
          transcription?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_audio_notes_activity_created_id_fkey"
            columns: ["activity_created_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_audio_notes_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_audio_notes_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_audio_notes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_conversations: {
        Row: {
          conversation_key: string
          created_at: string | null
          id: string
          messages: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          conversation_key: string
          created_at?: string | null
          id?: string
          messages?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          conversation_key?: string
          created_at?: string | null
          id?: string
          messages?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_decisions: {
        Row: {
          ai_reasoning: string | null
          confidence_score: number | null
          contact_id: string | null
          created_at: string | null
          deal_id: string | null
          decision_type: string
          description: string | null
          id: string
          priority: string | null
          processed_at: string | null
          snoozed_until: string | null
          status: string | null
          suggested_action: Json | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          ai_reasoning?: string | null
          confidence_score?: number | null
          contact_id?: string | null
          created_at?: string | null
          deal_id?: string | null
          decision_type: string
          description?: string | null
          id?: string
          priority?: string | null
          processed_at?: string | null
          snoozed_until?: string | null
          status?: string | null
          suggested_action?: Json | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          ai_reasoning?: string | null
          confidence_score?: number | null
          contact_id?: string | null
          created_at?: string | null
          deal_id?: string | null
          decision_type?: string
          description?: string | null
          id?: string
          priority?: string | null
          processed_at?: string | null
          snoozed_until?: string | null
          status?: string | null
          suggested_action?: Json | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_decisions_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_decisions_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_decisions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_feature_flags: {
        Row: {
          created_at: string | null
          enabled: boolean
          id: string
          key: string
          organization_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          enabled?: boolean
          id?: string
          key: string
          organization_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          enabled?: boolean
          id?: string
          key?: string
          organization_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_feature_flags_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_prompt_templates: {
        Row: {
          content: string
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean
          key: string
          organization_id: string
          updated_at: string | null
          version: number
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean
          key: string
          organization_id: string
          updated_at?: string | null
          version?: number
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean
          key?: string
          organization_id?: string
          updated_at?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "ai_prompt_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_prompt_templates_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_suggestion_interactions: {
        Row: {
          action: string
          created_at: string | null
          entity_id: string
          entity_type: string
          id: string
          snoozed_until: string | null
          suggestion_type: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string | null
          entity_id: string
          entity_type: string
          id?: string
          snoozed_until?: string | null
          suggestion_type: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          snoozed_until?: string | null
          suggestion_type?: string
          user_id?: string
        }
        Relationships: []
      }
      api_keys: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          key_hash: string
          key_prefix: string
          last_used_at: string | null
          name: string
          organization_id: string
          revoked_at: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          key_hash: string
          key_prefix: string
          last_used_at?: string | null
          name: string
          organization_id: string
          revoked_at?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          key_hash?: string
          key_prefix?: string
          last_used_at?: string | null
          name?: string
          organization_id?: string
          revoked_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "api_keys_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "api_keys_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          ip_address: string | null
          organization_id: string | null
          resource_id: string | null
          resource_type: string
          severity: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          organization_id?: string | null
          resource_id?: string | null
          resource_type: string
          severity?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          organization_id?: string | null
          resource_id?: string | null
          resource_type?: string
          severity?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      board_stages: {
        Row: {
          board_id: string | null
          color: string | null
          created_at: string | null
          id: string
          is_default: boolean | null
          label: string | null
          linked_lifecycle_stage: string | null
          name: string
          order: number
          organization_id: string | null
        }
        Insert: {
          board_id?: string | null
          color?: string | null
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          label?: string | null
          linked_lifecycle_stage?: string | null
          name: string
          order: number
          organization_id?: string | null
        }
        Update: {
          board_id?: string | null
          color?: string | null
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          label?: string | null
          linked_lifecycle_stage?: string | null
          name?: string
          order?: number
          organization_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "board_stages_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "boards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "board_stages_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      boards: {
        Row: {
          agent_behavior: string | null
          agent_name: string | null
          agent_role: string | null
          automation_suggestions: string[] | null
          created_at: string | null
          default_product_id: string | null
          deleted_at: string | null
          description: string | null
          entry_trigger: string | null
          goal_description: string | null
          goal_kpi: string | null
          goal_target_value: string | null
          goal_type: string | null
          id: string
          is_default: boolean | null
          key: string | null
          linked_lifecycle_stage: string | null
          lost_stage_id: string | null
          lost_stay_in_stage: boolean | null
          name: string
          next_board_id: string | null
          organization_id: string | null
          owner_id: string | null
          position: number | null
          template: string | null
          type: string | null
          updated_at: string | null
          won_stage_id: string | null
          won_stay_in_stage: boolean | null
        }
        Insert: {
          agent_behavior?: string | null
          agent_name?: string | null
          agent_role?: string | null
          automation_suggestions?: string[] | null
          created_at?: string | null
          default_product_id?: string | null
          deleted_at?: string | null
          description?: string | null
          entry_trigger?: string | null
          goal_description?: string | null
          goal_kpi?: string | null
          goal_target_value?: string | null
          goal_type?: string | null
          id?: string
          is_default?: boolean | null
          key?: string | null
          linked_lifecycle_stage?: string | null
          lost_stage_id?: string | null
          lost_stay_in_stage?: boolean | null
          name: string
          next_board_id?: string | null
          organization_id?: string | null
          owner_id?: string | null
          position?: number | null
          template?: string | null
          type?: string | null
          updated_at?: string | null
          won_stage_id?: string | null
          won_stay_in_stage?: boolean | null
        }
        Update: {
          agent_behavior?: string | null
          agent_name?: string | null
          agent_role?: string | null
          automation_suggestions?: string[] | null
          created_at?: string | null
          default_product_id?: string | null
          deleted_at?: string | null
          description?: string | null
          entry_trigger?: string | null
          goal_description?: string | null
          goal_kpi?: string | null
          goal_target_value?: string | null
          goal_type?: string | null
          id?: string
          is_default?: boolean | null
          key?: string | null
          linked_lifecycle_stage?: string | null
          lost_stage_id?: string | null
          lost_stay_in_stage?: boolean | null
          name?: string
          next_board_id?: string | null
          organization_id?: string | null
          owner_id?: string | null
          position?: number | null
          template?: string | null
          type?: string | null
          updated_at?: string | null
          won_stage_id?: string | null
          won_stay_in_stage?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "boards_default_product_id_fkey"
            columns: ["default_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "boards_lost_stage_id_fkey"
            columns: ["lost_stage_id"]
            isOneToOne: false
            referencedRelation: "board_stages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "boards_next_board_id_fkey"
            columns: ["next_board_id"]
            isOneToOne: false
            referencedRelation: "boards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "boards_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "boards_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "boards_won_stage_id_fkey"
            columns: ["won_stage_id"]
            isOneToOne: false
            referencedRelation: "board_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_tags: {
        Row: {
          contact_id: string
          created_at: string | null
          tag_id: string
        }
        Insert: {
          contact_id: string
          created_at?: string | null
          tag_id: string
        }
        Update: {
          contact_id?: string
          created_at?: string | null
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_tags_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          address: Json | null
          avatar: string | null
          birth_date: string | null
          client_company_id: string | null
          company_name: string | null
          created_at: string | null
          datacrazy_id: string | null
          deleted_at: string | null
          email: string | null
          id: string
          instagram: string | null
          last_interaction: string | null
          last_purchase_date: string | null
          metadata: Json | null
          name: string
          notes: string | null
          organization_id: string | null
          owner_id: string | null
          phone: string | null
          raw_phone: string | null
          role: string | null
          source: string | null
          stage: string | null
          status: string | null
          tax_id: string | null
          total_value: number | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address?: Json | null
          avatar?: string | null
          birth_date?: string | null
          client_company_id?: string | null
          company_name?: string | null
          created_at?: string | null
          datacrazy_id?: string | null
          deleted_at?: string | null
          email?: string | null
          id?: string
          instagram?: string | null
          last_interaction?: string | null
          last_purchase_date?: string | null
          metadata?: Json | null
          name: string
          notes?: string | null
          organization_id?: string | null
          owner_id?: string | null
          phone?: string | null
          raw_phone?: string | null
          role?: string | null
          source?: string | null
          stage?: string | null
          status?: string | null
          tax_id?: string | null
          total_value?: number | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: Json | null
          avatar?: string | null
          birth_date?: string | null
          client_company_id?: string | null
          company_name?: string | null
          created_at?: string | null
          datacrazy_id?: string | null
          deleted_at?: string | null
          email?: string | null
          id?: string
          instagram?: string | null
          last_interaction?: string | null
          last_purchase_date?: string | null
          metadata?: Json | null
          name?: string
          notes?: string | null
          organization_id?: string | null
          owner_id?: string | null
          phone?: string | null
          raw_phone?: string | null
          role?: string | null
          source?: string | null
          stage?: string | null
          status?: string | null
          tax_id?: string | null
          total_value?: number | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contacts_client_company_id_fkey"
            columns: ["client_company_id"]
            isOneToOne: false
            referencedRelation: "crm_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contacts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contacts_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_companies: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          id: string
          industry: string | null
          name: string
          organization_id: string | null
          owner_id: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          industry?: string | null
          name: string
          organization_id?: string | null
          owner_id?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          industry?: string | null
          name?: string
          organization_id?: string | null
          owner_id?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_companies_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_companies_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_field_definitions: {
        Row: {
          created_at: string | null
          entity_type: string
          id: string
          key: string
          label: string
          options: string[] | null
          organization_id: string | null
          type: string
        }
        Insert: {
          created_at?: string | null
          entity_type?: string
          id?: string
          key: string
          label: string
          options?: string[] | null
          organization_id?: string | null
          type: string
        }
        Update: {
          created_at?: string | null
          entity_type?: string
          id?: string
          key?: string
          label?: string
          options?: string[] | null
          organization_id?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "custom_field_definitions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      deal_files: {
        Row: {
          created_at: string | null
          created_by: string | null
          deal_id: string
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          mime_type: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          deal_id: string
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          deal_id?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deal_files_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deal_files_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      deal_items: {
        Row: {
          created_at: string | null
          deal_id: string | null
          id: string
          name: string
          organization_id: string | null
          price: number
          product_id: string | null
          quantity: number
        }
        Insert: {
          created_at?: string | null
          deal_id?: string | null
          id?: string
          name: string
          organization_id?: string | null
          price?: number
          product_id?: string | null
          quantity?: number
        }
        Update: {
          created_at?: string | null
          deal_id?: string | null
          id?: string
          name?: string
          organization_id?: string | null
          price?: number
          product_id?: string | null
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "deal_items_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deal_items_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deal_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      deal_notes: {
        Row: {
          content: string
          created_at: string | null
          created_by: string | null
          deal_id: string
          id: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by?: string | null
          deal_id: string
          id?: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string | null
          deal_id?: string
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deal_notes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deal_notes_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      deals: {
        Row: {
          ai_summary: string | null
          board_id: string | null
          client_company_id: string | null
          closed_at: string | null
          contact_id: string | null
          created_at: string | null
          custom_fields: Json | null
          datacrazy_code: number | null
          datacrazy_id: string | null
          deleted_at: string | null
          discount: number | null
          id: string
          is_lost: boolean
          is_won: boolean
          last_stage_change_date: string | null
          loss_reason: string | null
          loss_reason_id: string | null
          loss_reason_text: string | null
          organization_id: string
          owner_id: string | null
          priority: string | null
          probability: number | null
          stage_id: string | null
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          value: number | null
        }
        Insert: {
          ai_summary?: string | null
          board_id?: string | null
          client_company_id?: string | null
          closed_at?: string | null
          contact_id?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          datacrazy_code?: number | null
          datacrazy_id?: string | null
          deleted_at?: string | null
          discount?: number | null
          id?: string
          is_lost?: boolean
          is_won?: boolean
          last_stage_change_date?: string | null
          loss_reason?: string | null
          loss_reason_id?: string | null
          loss_reason_text?: string | null
          organization_id: string
          owner_id?: string | null
          priority?: string | null
          probability?: number | null
          stage_id?: string | null
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          value?: number | null
        }
        Update: {
          ai_summary?: string | null
          board_id?: string | null
          client_company_id?: string | null
          closed_at?: string | null
          contact_id?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          datacrazy_code?: number | null
          datacrazy_id?: string | null
          deleted_at?: string | null
          discount?: number | null
          id?: string
          is_lost?: boolean
          is_won?: boolean
          last_stage_change_date?: string | null
          loss_reason?: string | null
          loss_reason_id?: string | null
          loss_reason_text?: string | null
          organization_id?: string
          owner_id?: string | null
          priority?: string | null
          probability?: number | null
          stage_id?: string | null
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "deals_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "boards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_client_company_id_fkey"
            columns: ["client_company_id"]
            isOneToOne: false
            referencedRelation: "crm_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_loss_reason_id_fkey"
            columns: ["loss_reason_id"]
            isOneToOne: false
            referencedRelation: "loss_reasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "board_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      integration_inbound_sources: {
        Row: {
          active: boolean
          created_at: string | null
          entry_board_id: string
          entry_stage_id: string
          id: string
          name: string
          organization_id: string
          secret: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean
          created_at?: string | null
          entry_board_id: string
          entry_stage_id: string
          id?: string
          name?: string
          organization_id: string
          secret: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean
          created_at?: string | null
          entry_board_id?: string
          entry_stage_id?: string
          id?: string
          name?: string
          organization_id?: string
          secret?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "integration_inbound_sources_entry_board_id_fkey"
            columns: ["entry_board_id"]
            isOneToOne: false
            referencedRelation: "boards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "integration_inbound_sources_entry_stage_id_fkey"
            columns: ["entry_stage_id"]
            isOneToOne: false
            referencedRelation: "board_stages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "integration_inbound_sources_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      integration_outbound_endpoints: {
        Row: {
          active: boolean
          created_at: string | null
          events: string[]
          id: string
          name: string
          organization_id: string
          secret: string
          updated_at: string | null
          url: string
        }
        Insert: {
          active?: boolean
          created_at?: string | null
          events?: string[]
          id?: string
          name?: string
          organization_id: string
          secret: string
          updated_at?: string | null
          url: string
        }
        Update: {
          active?: boolean
          created_at?: string | null
          events?: string[]
          id?: string
          name?: string
          organization_id?: string
          secret?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "integration_outbound_endpoints_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          company_name: string | null
          converted_to_contact_id: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          notes: string | null
          organization_id: string | null
          owner_id: string | null
          role: string | null
          source: string | null
          status: string | null
        }
        Insert: {
          company_name?: string | null
          converted_to_contact_id?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          organization_id?: string | null
          owner_id?: string | null
          role?: string | null
          source?: string | null
          status?: string | null
        }
        Update: {
          company_name?: string | null
          converted_to_contact_id?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          organization_id?: string | null
          owner_id?: string | null
          role?: string | null
          source?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_converted_to_contact_id_fkey"
            columns: ["converted_to_contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lifecycle_stages: {
        Row: {
          color: string
          created_at: string | null
          id: string
          is_default: boolean | null
          name: string
          order: number
        }
        Insert: {
          color: string
          created_at?: string | null
          id: string
          is_default?: boolean | null
          name: string
          order: number
        }
        Update: {
          color?: string
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          order?: number
        }
        Relationships: []
      }
      loss_reasons: {
        Row: {
          created_at: string | null
          id: string
          name: string
          organization_id: string | null
          requires_justification: boolean | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          organization_id?: string | null
          requires_justification?: boolean | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          organization_id?: string | null
          requires_justification?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "loss_reasons_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_invites: {
        Row: {
          created_at: string | null
          created_by: string | null
          email: string | null
          expires_at: string | null
          id: string
          organization_id: string | null
          role: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          expires_at?: string | null
          id?: string
          organization_id?: string | null
          role?: string
          token?: string
          used_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          expires_at?: string | null
          id?: string
          organization_id?: string | null
          role?: string
          token?: string
          used_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_invites_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_invites_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_settings: {
        Row: {
          ai_anthropic_key: string | null
          ai_enabled: boolean
          ai_google_key: string | null
          ai_model: string | null
          ai_openai_key: string | null
          ai_provider: string | null
          created_at: string | null
          organization_id: string
          updated_at: string | null
        }
        Insert: {
          ai_anthropic_key?: string | null
          ai_enabled?: boolean
          ai_google_key?: string | null
          ai_model?: string | null
          ai_openai_key?: string | null
          ai_provider?: string | null
          created_at?: string | null
          organization_id: string
          updated_at?: string | null
        }
        Update: {
          ai_anthropic_key?: string | null
          ai_enabled?: boolean
          ai_google_key?: string | null
          ai_model?: string | null
          ai_openai_key?: string | null
          ai_provider?: string | null
          created_at?: string | null
          organization_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_settings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          active: boolean | null
          created_at: string | null
          datacrazy_id: string | null
          description: string | null
          id: string
          image: string | null
          name: string
          organization_id: string | null
          owner_id: string | null
          price: number
          sku: string | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          datacrazy_id?: string | null
          description?: string | null
          id?: string
          image?: string | null
          name: string
          organization_id?: string | null
          owner_id?: string | null
          price?: number
          sku?: string | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          datacrazy_id?: string | null
          description?: string | null
          id?: string
          image?: string | null
          name?: string
          organization_id?: string | null
          owner_id?: string | null
          price?: number
          sku?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar: string | null
          avatar_url: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          name: string | null
          nickname: string | null
          organization_id: string | null
          phone: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar?: string | null
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          name?: string | null
          nickname?: string | null
          organization_id?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar?: string | null
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          name?: string | null
          nickname?: string | null
          organization_id?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      quick_scripts: {
        Row: {
          category: string
          created_at: string | null
          icon: string | null
          id: string
          is_system: boolean | null
          template: string
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          icon?: string | null
          id?: string
          is_system?: boolean | null
          template: string
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          icon?: string | null
          id?: string
          is_system?: boolean | null
          template?: string
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quick_scripts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      rate_limits: {
        Row: {
          created_at: string
          endpoint: string
          id: string
          identifier: string
        }
        Insert: {
          created_at?: string
          endpoint: string
          id?: string
          identifier: string
        }
        Update: {
          created_at?: string
          endpoint?: string
          id?: string
          identifier?: string
        }
        Relationships: []
      }
      security_alerts: {
        Row: {
          acknowledged_at: string | null
          acknowledged_by: string | null
          alert_type: string
          created_at: string | null
          description: string | null
          details: Json | null
          id: string
          organization_id: string | null
          severity: string
          title: string
          user_id: string | null
        }
        Insert: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_type: string
          created_at?: string | null
          description?: string | null
          details?: Json | null
          id?: string
          organization_id?: string | null
          severity?: string
          title: string
          user_id?: string | null
        }
        Update: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_type?: string
          created_at?: string | null
          description?: string | null
          details?: Json | null
          id?: string
          organization_id?: string | null
          severity?: string
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "security_alerts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      system_notifications: {
        Row: {
          created_at: string | null
          id: string
          link: string | null
          message: string
          organization_id: string | null
          read_at: string | null
          severity: string | null
          title: string
          type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          link?: string | null
          message: string
          organization_id?: string | null
          read_at?: string | null
          severity?: string | null
          title: string
          type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          link?: string | null
          message?: string
          organization_id?: string | null
          read_at?: string | null
          severity?: string | null
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "system_notifications_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          color: string | null
          created_at: string | null
          id: string
          name: string
          organization_id: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          id?: string
          name: string
          organization_id?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          id?: string
          name?: string
          organization_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tags_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_consents: {
        Row: {
          consent_type: string
          consented_at: string
          id: string
          ip_address: string | null
          revoked_at: string | null
          user_agent: string | null
          user_id: string
          version: string
        }
        Insert: {
          consent_type: string
          consented_at?: string
          id?: string
          ip_address?: string | null
          revoked_at?: string | null
          user_agent?: string | null
          user_id: string
          version: string
        }
        Update: {
          consent_type?: string
          consented_at?: string
          id?: string
          ip_address?: string | null
          revoked_at?: string | null
          user_agent?: string | null
          user_id?: string
          version?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          active_board_id: string | null
          ai_anthropic_caching: boolean | null
          ai_anthropic_key: string | null
          ai_api_key: string | null
          ai_google_key: string | null
          ai_model: string | null
          ai_openai_key: string | null
          ai_provider: string | null
          ai_search: boolean | null
          ai_thinking: boolean | null
          created_at: string | null
          dark_mode: boolean | null
          default_route: string | null
          id: string
          inbox_view_mode: string | null
          onboarding_completed: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          active_board_id?: string | null
          ai_anthropic_caching?: boolean | null
          ai_anthropic_key?: string | null
          ai_api_key?: string | null
          ai_google_key?: string | null
          ai_model?: string | null
          ai_openai_key?: string | null
          ai_provider?: string | null
          ai_search?: boolean | null
          ai_thinking?: boolean | null
          created_at?: string | null
          dark_mode?: boolean | null
          default_route?: string | null
          id?: string
          inbox_view_mode?: string | null
          onboarding_completed?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          active_board_id?: string | null
          ai_anthropic_caching?: boolean | null
          ai_anthropic_key?: string | null
          ai_api_key?: string | null
          ai_google_key?: string | null
          ai_model?: string | null
          ai_openai_key?: string | null
          ai_provider?: string | null
          ai_search?: boolean | null
          ai_thinking?: boolean | null
          created_at?: string | null
          dark_mode?: boolean | null
          default_route?: string | null
          id?: string
          inbox_view_mode?: string | null
          onboarding_completed?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_active_board_id_fkey"
            columns: ["active_board_id"]
            isOneToOne: false
            referencedRelation: "boards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      webhook_deliveries: {
        Row: {
          attempted_at: string
          endpoint_id: string
          error: string | null
          event_id: string
          id: string
          organization_id: string
          request_id: number | null
          response_status: number | null
          status: string
        }
        Insert: {
          attempted_at?: string
          endpoint_id: string
          error?: string | null
          event_id: string
          id?: string
          organization_id: string
          request_id?: number | null
          response_status?: number | null
          status?: string
        }
        Update: {
          attempted_at?: string
          endpoint_id?: string
          error?: string | null
          event_id?: string
          id?: string
          organization_id?: string
          request_id?: number | null
          response_status?: number | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhook_deliveries_endpoint_id_fkey"
            columns: ["endpoint_id"]
            isOneToOne: false
            referencedRelation: "integration_outbound_endpoints"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "webhook_deliveries_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "webhook_events_out"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "webhook_deliveries_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      webhook_events_in: {
        Row: {
          created_contact_id: string | null
          created_deal_id: string | null
          error: string | null
          external_event_id: string | null
          id: string
          organization_id: string
          payload: Json
          provider: string
          received_at: string
          source_id: string
          status: string
        }
        Insert: {
          created_contact_id?: string | null
          created_deal_id?: string | null
          error?: string | null
          external_event_id?: string | null
          id?: string
          organization_id: string
          payload?: Json
          provider?: string
          received_at?: string
          source_id: string
          status?: string
        }
        Update: {
          created_contact_id?: string | null
          created_deal_id?: string | null
          error?: string | null
          external_event_id?: string | null
          id?: string
          organization_id?: string
          payload?: Json
          provider?: string
          received_at?: string
          source_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhook_events_in_created_contact_id_fkey"
            columns: ["created_contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "webhook_events_in_created_deal_id_fkey"
            columns: ["created_deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "webhook_events_in_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "webhook_events_in_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "integration_inbound_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      webhook_events_out: {
        Row: {
          created_at: string
          deal_id: string | null
          event_type: string
          from_stage_id: string | null
          id: string
          organization_id: string
          payload: Json
          to_stage_id: string | null
        }
        Insert: {
          created_at?: string
          deal_id?: string | null
          event_type: string
          from_stage_id?: string | null
          id?: string
          organization_id: string
          payload?: Json
          to_stage_id?: string | null
        }
        Update: {
          created_at?: string
          deal_id?: string | null
          event_type?: string
          from_stage_id?: string | null
          id?: string
          organization_id?: string
          payload?: Json
          to_stage_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "webhook_events_out_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "webhook_events_out_from_stage_id_fkey"
            columns: ["from_stage_id"]
            isOneToOne: false
            referencedRelation: "board_stages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "webhook_events_out_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "webhook_events_out_to_stage_id_fkey"
            columns: ["to_stage_id"]
            isOneToOne: false
            referencedRelation: "board_stages"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      _api_key_make_token: { Args: never; Returns: string }
      _api_key_sha256_hex: { Args: { token: string }; Returns: string }
      cleanup_rate_limits: {
        Args: { older_than_minutes?: number }
        Returns: number
      }
      create_api_key: {
        Args: { p_name: string }
        Returns: {
          api_key_id: string
          key_prefix: string
          organization_id: string
          token: string
        }[]
      }
      get_contact_stage_counts: {
        Args: never
        Returns: {
          count: number
          stage: string
        }[]
      }
      get_dashboard_stats: { Args: never; Returns: Json }
      get_singleton_organization_id: { Args: never; Returns: string }
      is_instance_initialized: { Args: never; Returns: boolean }
      log_audit_event: {
        Args: {
          p_action: string
          p_details?: Json
          p_resource_id?: string
          p_resource_type: string
          p_severity?: string
        }
        Returns: string
      }
      mark_deal_lost: {
        Args: { deal_id: string; reason?: string }
        Returns: undefined
      }
      mark_deal_won: { Args: { deal_id: string }; Returns: undefined }
      reopen_deal: { Args: { deal_id: string }; Returns: undefined }
      revoke_api_key: { Args: { p_api_key_id: string }; Returns: undefined }
      unaccent: { Args: { "": string }; Returns: string }
      validate_api_key: {
        Args: { p_token: string }
        Returns: {
          api_key_id: string
          api_key_prefix: string
          organization_id: string
          organization_name: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
