import type {
  OpenDialogOptions,
  OpenDialogReturnValue,
  SaveDialogOptions,
  SaveDialogReturnValue,
  MessageBoxOptions,
  MessageBoxReturnValue,
  CertificateTrustDialogOptions,
} from 'electron';

export const RemoteEventName = '_remote_dialog_event';

export interface RemoteDialog {
  showErrorBox(title: string, content: string): Promise<void>;
  showOpenDialog(options: OpenDialogOptions): Promise<OpenDialogReturnValue>;
  showSaveDialog(options: SaveDialogOptions): Promise<SaveDialogReturnValue>;
  showMessageBox(options: MessageBoxOptions): Promise<MessageBoxReturnValue>;
  showCertificateTrustDialog(options: CertificateTrustDialogOptions): Promise<void>;
}

/** 远程返回事件 */
export interface RemoteReplyEvent {
  /** 返回值 */
  returnValue: any;
  /** 返回错误 */
  error?: string;
}

/** 远程事件 */
export interface RemoteToEvent {
  /** 属性名称 */
  key: string;
  /** 调用方法参数 */
  params?: any[];
}
