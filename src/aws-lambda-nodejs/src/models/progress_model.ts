import { AppUserProgressionVocabs } from './app_user_progression_vocabs_model';
import { AppUserProgressionQuestions } from './app_user_progression_questions_model';
import { IAppUserProgressionVideosFranchise } from './app_user_progression_videos_franchise_model';
import { AppUserProgressionVideos } from './app_user_progression_videos_model';
import { AppUserProgressionLevels } from './app_user_progression_levels_model';
export interface IProgress {
    sessionID: string;
    appUserID: string;
    questionsUserDataList: Array<AppUserProgressionQuestions>;
    videosFranchiseUserDataList: Array<IAppUserProgressionVideosFranchise>;
    videoUserDataList: Array<AppUserProgressionVideos>;
    vocabsUserDataList: Array<AppUserProgressionVocabs>;
    levelsUserDataList: Array<AppUserProgressionLevels>;
}

export class Progress implements IProgress {
    sessionID: string;
    appUserID: string;
    questionsUserDataList: Array<AppUserProgressionQuestions>;
    videosFranchiseUserDataList: Array<IAppUserProgressionVideosFranchise>;
    videoUserDataList: Array<AppUserProgressionVideos>;
    vocabsUserDataList: Array<AppUserProgressionVocabs>;
    levelsUserDataList: Array<AppUserProgressionLevels>;

}
