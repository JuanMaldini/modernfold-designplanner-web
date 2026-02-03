
export interface E3DSCommand {
  cmd: string;
  value?: any;
  [key: string]: any;
}

export interface E3DSResponse {
  type: string;
  descriptor?: any;
  [key: string]: any;
}

export type E3DSStage =
  | "stage1_inqueued"
  | "stage2_deQueued"
  | "stage3_slotOccupied"
  | "stage4_playBtnShowedUp"
  | "stage5_playBtnPressed"
  | "sessionExpired"
  | "videoStreamFailed";
