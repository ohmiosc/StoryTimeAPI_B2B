export interface IUnityWebhookVO {

  buildNumber?: number;
  buildStatus?: string;
  buildTargetName?: string;
  cleanBuild?: boolean;
  credentialsOutdated?: boolean;
  lastBuiltRevision?: string;
  local?: boolean;
  orgForeignKey?: number;
  platform?: 'android' | 'ios';
  platformName?: string;
  projectGuid?: string;
  projectName?: string;
  scmType?: string;
  startedBy?: string;
  links?: {
    api_self?: {
      href?: string;
    }
  }
}
