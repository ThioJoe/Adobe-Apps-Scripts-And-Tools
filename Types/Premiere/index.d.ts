/// <reference path="../../shared/global.d.ts" />
// You'll also need the global.d.ts and other shared type definitions from: https://github.com/docsforadobe/Types-for-Adobe
// And you'll need to adjust the path above to correctly reference the location of your global.d.ts file.
//
// Adobe Premiere Pro Types
// Source: https://github.com/ThioJoe/Adobe-Apps-Scripts-And-Tools
//
// I used the Types-For-Adobe types file as an original base for this file, but have extended them with a more complete set of Adobe Premiere Pro types and parameters.
//      - I don't version this, so assume it is always for the latest version of Premiere Pro.
//      - I have tools for extracting additional type information at: https://github.com/ThioJoe/Extendscript-XML-Typscript-HTML-Converter
//
//
// -------------------------------------------------------------------------------------------------------------------------------------

/**
 * Provides the following event types: onMediaInfoCreated, onBatchItemStatusChanged, onItemEncodingStarted, onAudioPreEncodeProgress, onEncodingItemProgressUpdated, onEncodeComplete, onError, onPostProcessListInitialized
 */
declare class AMEExportEvent {

    /**
     * Returns the audio pre-encoding info for the event type onAudioPreEncodeProgress (available since 24.0).
     */
    readonly audioInfo: string;

    /**
     * Returns the audio pre-encoding progress for the event type onAudioPreEncodeProgress (available since 24.0).
     */
    readonly audioProgress: number;

    /**
     * Returns true after encoding has been completed for a batch item. Can be called for onEncodeComplete event.
     */
    readonly encodeCompleteStatus: boolean;

    /**
     * Returns the encoding time in milliseconds. Can be called for onEncodeComplete event.
     */
    readonly encodeCompleteTime: number;

    /**
     * Returns export error string (available since 25.2).
     */
    readonly error: string;

    /**
     * Returns the batch group index. Can be called for onBatchItemStatusChanged event.
     */
    readonly groupIndex: number;

    /**
     * Returns the batch item index. Can be called for onBatchItemStatusChanged event.
     */
    readonly itemIndex: number;

    /**
     * Notify the encoding progress (Deprecated).
     */
    static readonly oEncodingItemProgressUpdated: string;

    /**
     * Notify when the audio pre-encode progress changes (available since 24.0)
     */
    static readonly onAudioPreEncodeProgress: string;

    /**
     * Notify when batch item status has been changed. You can call the API's groupIndex, itemIndex and status for more info.
     */
    static readonly onBatchItemStatusChanged: string;

    /**
     * Notify when the batch item has been encoded. You can call the API's encodeCompleteStatus and encodeCompleteTime for more info.
     */
    static readonly onEncodeComplete: string;

    /**
     * Notify the encoding progress.
     */
    static readonly onEncodingItemProgressUpdated: string;

    /**
     * Notify when there's an error while encoding the batch item.
     */
    static readonly onError: string;

    /**
     * Notify when the encoding of a batch item has started.
     */
    static readonly onItemEncodingStarted: string;

    /**
     * Notify when media info has been created.
     */
    static readonly onMediaInfoCreated: string;

    /**
     * Notify when the post process list is initialized.
     */
    static readonly onPostProcessListInitialized: string;

    /**
     * Returns the batch item encoding progress value which is between 0 and 1. Can be called for onEncodingItemProgressUpdated event
     */
    readonly progress: number;

    /**
     * Returns the batch item status. 0 : Waiting, 1 : Done, 2 : Failed, 3 : Skipped, 4 : Encoding, 5 : Paused, 6 : Stopped,7 : Any, 8 : AutoStart, 9 : Done Warning, 10 : Watch Folder Waiting. Can be called for onBatchItemStatusChanged event.
     */
    readonly status: number;
    static addEventListener(): any;
    static dispatchEvent(): any;
    static removeEventListener(): any;
}

/**
 * Event will be triggered when the active sequence has been changed
 */
declare interface ActiveSequenceChangedEventObject {
}

/**
 * Event will be triggered when the active sequence selection has been changed
 */
declare interface ActiveSequenceSelectionChangedEventObject {
}

/**
 * Event will be triggered when track(s) added to and/or removed from sequence.
 */
declare interface ActiveSequenceStructureChangedEventObject {
}

/**
 * Event will be triggered when a track item has been added.
 */
declare interface ActiveSequenceTrackItemAddedEventObject {

    /**
     * Returns the belonging track of the added track item.
     */
    readonly track: Track;

    /**
     * Returns the track item which has been added.
     */
    readonly trackItemAdded: TrackItem;
}

/**
 * Event will be triggered when a track item has been removed.
 */
declare interface ActiveSequenceTrackItemRemovedEventObject {

    /**
     * Returns the belonging track of the removed track item.
     */
    readonly track: Track;

    /**
     * Returns the track item which has been removed.
     */
    readonly trackItemRemoved: TrackItem;
}

/**
 * Static clustering object for Affinity Propagation algorithm
 */
declare class AffinityPropagation {

    /**
     * Performs affinity propagation clustering on data points. The preferences parameter contains: convergenceIterations (int32), maximumIterations (int32), dampingFactor (float), preferenceSize (float)
     */
    static cluster(dataPointMatrix: object, preferences: object): Clusters;
}

/**
 * Analyzer Host which contains ongoing analysis tasks and provides APIs to manage them.
 */
declare class AnalyzerHost {

    /**
     * Return the number of currently running analyzers for the given analyzer guid.
     */
    countJobsForAnalyzer(analyzerGuid: object): object;

    /**
     * Get the default analyzer host for the running application
     */
    static getDefault(): object;

    /**
     * Return the number of currently running analyzers for the given analyzer guid.
     */
    waitForAnalyzerCompletion(analyzerGuid: object): object;
}

/**
 * Anywhere class
 */
declare class Anywhere {

    bind(eventName: string, function_: any): void

    getAuthenticationToken(): string | undefined;
    getCurrentEditingSessionActiveSequenceURL(): string | undefined;
    getCurrentEditingSessionSelectionURL(): string | undefined;
    getCurrentEditingSessionURL(): string | undefined;
    isProductionOpen(): boolean;
    listProductions(): RemoteProductionCollection;
    openProduction(inProductionURL: string): boolean | undefined;

    setAuthenticationToken(inAuthToken: string, inEmail: string, p2: string): boolean;
    setTimeout(eventName: string, function_: any, milliseconds: number): void
    unbind(eventName: string): void
    openTeamProjectSnapshot(inTeamProjectSnapshotPath: string): boolean | undefined;
}

/**
 * Application class
 */
declare class Application {

    readonly anywhere: Anywhere;
    readonly build: string;
    readonly csxs: Csxs
    readonly encoder: Encoder;
    readonly projectManager: ProjectManager;
    readonly getAppPrefPath: string;
    readonly getAppSystemPrefPath: string;
    readonly getPProPrefPath: string;
    readonly getPProSystemPrefPath: string;
    readonly learnPanelContentDirPath: string;
    readonly learnPanelExampleProjectDirPath: string;
    readonly metadata: Metadata
    readonly path: string;
    /**
     * This is the current active project.
     */
    project: Project;
    readonly projects: ProjectCollection;
    readonly properties: Properties;
    readonly sourceMonitor: SourceMonitor;
    readonly userGuid: string | undefined;
    readonly version: string;
    bind(eventName: ApplicationEvent, function_: Function): void

    /**
     * Notifies App that Preferences have changed
     * Only valid argument currently is 'BE::PreferencesScratchDisksChanged'
     */
    broadcastPrefsChanged(preferencesThatChanged: string): boolean
    getEnableProxies(): number;

    /**
     * Gets an arra of ProjectItem objects that are currently selected in the Project panel.
     */
    getCurrentProjectViewSelection(): Array<ProjectItem> | undefined;

    /**
     * Checks whether file specified is a doc
     * @param filePath This is the path to be checked
     * @returns true if the document at that path is openable as a PPro project
     */
    isDocument(filePath: string): boolean
    isDocumentOpen(): boolean;

    openDocument(
        filePath: string,
        bypassConversionDialog?: boolean,
        bypassLocateFile?: boolean,
        bypassWarningDialog?: boolean,
        hideFromMRUList?: boolean,
    ): boolean

    /**
     * @param newValueForTranscodeOnIngest
     * @returns the newly-set state for whether or not PPro transcodes files upon ingest.
     */
    setEnableTranscodeOnIngest(newValueForTranscodeOnIngest: boolean): boolean;

    openFCPXML(path: string, projPath: string): boolean
    quit(): boolean;

    setEnableProxies(enable: boolean): boolean;

    setExtensionPersistent(extensionID: string, state?: boolean): boolean;

    setSDKEventMessage(value: string, eventType: string): boolean
    setScratchDiskPath(value: string, type: string): boolean
    setTimeout(eventName: string, function_: any, milliseconds: number): void

    getProjectViewIDs(): Array<string> | undefined;

    getProjectFromViewID(viewID: string): Project | undefined;

    showCursor(enable: boolean): boolean;

    getProjectViewSelection(viewID: string): Array<ProjectItem> | undefined;

    setProjectViewSelection(projectViewSelection: Array<ProjectItem>, viewID: string): boolean;
    onItemAddedToProjectSuccess: undefined

    /**
     * @returns an array of the names of all available workspaces.
     */
    getWorkspaces(): Array<string>

    /**
     * @param workspaceName Name of workspace to use
     * @returns true if successful
     */
    setWorkspace(workspaceName: string): boolean;

    /**
     * @param eventName event to which to subscribe
     * @param function_ function to be called
     */
    addEventListener(eventName: string, function_: any): void

    trace(message: string): boolean
    unbind(eventName: string): void
    enableQE(): boolean;
    newProject(projectName: string): boolean

    readonly production: PrProduction;

    openPrProduction(path: string): PrProduction
    readonly isStagingEnvironment: boolean;
    getConstant(name: string): number;
    isWindowVisible(windowClass: string): boolean;
    newPrProduction(uArg1: string): object;
    refresh(): boolean;
    write(p0: string, uArg1: boolean): boolean;
    readonly getLookInfo: string;
    readonly getSelectedLookData: string;

    /**
     * Returns if the PPro application is licensed.
     */
    readonly isLicensed: boolean;
    dontShowWelcomeScreenAgain(uArg1: boolean): boolean;
    isUserSharingAppUsageData(): boolean;
}

/**
 * Provides scripting env access to MF::ArbData
 */
declare class ArbData {

    /**
     * Construct an ArbData Object.
     */
    constructor(inBase64EncodedStringData: string);

    /**
     * Gets the binary value encoded with base64
     */
    getBase64EncodeStringValue(): string;
}

/**
 * AudioChannelLayout represents a channel layout with named channels proved as constants AUDIOCHANNELLABEL_ ... An AudioChannelLayout can be created using an Array of these constants or it could be created using one of the constants CHANNELLAYOUT_ ... to create a common layout.
 */
declare class AudioChannelLayout {

    /**
     * Ambisonic-W
     */
    static readonly AUDIOCHANNELLABEL_AMBISONIC_W: number;

    /**
     * Ambisonic-X
     */
    static readonly AUDIOCHANNELLABEL_AMBISONIC_X: number;

    /**
     * Ambisonic-Y
     */
    static readonly AUDIOCHANNELLABEL_AMBISONIC_Y: number;

    /**
     * Ambisonic-Z
     */
    static readonly AUDIOCHANNELLABEL_AMBISONIC_Z: number;

    /**
     * Back-Center
     */
    static readonly AUDIOCHANNELLABEL_BACKCENTER: number;

    /**
     * Back-Left
     */
    static readonly AUDIOCHANNELLABEL_BACKLEFT: number;

    /**
     * Back-Right
     */
    static readonly AUDIOCHANNELLABEL_BACKRIGHT: number;

    /**
     * Bottom-Front-Center
     */
    static readonly AUDIOCHANNELLABEL_BOTTOMFRONTCENTER: number;

    /**
     * Bottom-Front-Left
     */
    static readonly AUDIOCHANNELLABEL_BOTTOMFRONTLEFT: number;

    /**
     * Bottom-Front-Right
     */
    static readonly AUDIOCHANNELLABEL_BOTTOMFRONTRIGHT: number;

    /**
     * Discrete
     */
    static readonly AUDIOCHANNELLABEL_DISCRETE: number;

    /**
     * Front-Center
     */
    static readonly AUDIOCHANNELLABEL_FRONTCENTER: number;

    /**
     * Front-Left
     */
    static readonly AUDIOCHANNELLABEL_FRONTLEFT: number;

    /**
     * Front-Left-Of-Center
     */
    static readonly AUDIOCHANNELLABEL_FRONTLEFTOFCENTER: number;

    /**
     * Front-Left-Wide
     */
    static readonly AUDIOCHANNELLABEL_FRONTLEFTWIDE: number;

    /**
     * Front-Right
     */
    static readonly AUDIOCHANNELLABEL_FRONTRIGHT: number;

    /**
     * Front-Right-Of-Center
     */
    static readonly AUDIOCHANNELLABEL_FRONTRIGHTOFCENTER: number;

    /**
     * Front-Right-Wide
     */
    static readonly AUDIOCHANNELLABEL_FRONTRIGHTWIDE: number;

    /**
     * Left-Height
     */
    static readonly AUDIOCHANNELLABEL_LEFTHEIGHT: number;

    /**
     * Left-Total
     */
    static readonly AUDIOCHANNELLABEL_LEFTTOTAL: number;

    /**
     * LFE2
     */
    static readonly AUDIOCHANNELLABEL_LFE2: number;

    /**
     * Low-Frequency
     */
    static readonly AUDIOCHANNELLABEL_LOWFREQUENCY: number;

    /**
     * Proximity-Left
     */
    static readonly AUDIOCHANNELLABEL_PROXIMITYLEFT: number;

    /**
     * Proximity-Right
     */
    static readonly AUDIOCHANNELLABEL_PROXIMITYRIGHT: number;

    /**
     * Rear-Surround-Left
     */
    static readonly AUDIOCHANNELLABEL_REARSURROUNDLEFT: number;

    /**
     * Rear-Surround-Right
     */
    static readonly AUDIOCHANNELLABEL_REARSURROUNDRIGHT: number;

    /**
     * Right-Height
     */
    static readonly AUDIOCHANNELLABEL_RIGHTHEIGHT: number;

    /**
     * Right-Total
     */
    static readonly AUDIOCHANNELLABEL_RIGHTTOTAL: number;

    /**
     * Side-Left
     */
    static readonly AUDIOCHANNELLABEL_SIDELEFT: number;

    /**
     * Side-Right
     */
    static readonly AUDIOCHANNELLABEL_SIDERIGHT: number;

    /**
     * Top-Back-Center
     */
    static readonly AUDIOCHANNELLABEL_TOPBACKCENTER: number;

    /**
     * Top-Back-Left
     */
    static readonly AUDIOCHANNELLABEL_TOPBACKLEFT: number;

    /**
     * Top-Back-Right
     */
    static readonly AUDIOCHANNELLABEL_TOPBACKRIGHT: number;

    /**
     * Top-Center
     */
    static readonly AUDIOCHANNELLABEL_TOPCENTER: number;

    /**
     * Top-Front-Center
     */
    static readonly AUDIOCHANNELLABEL_TOPFRONTCENTER: number;

    /**
     * Top-Front-Left
     */
    static readonly AUDIOCHANNELLABEL_TOPFRONTLEFT: number;

    /**
     * Top-Front-Right
     */
    static readonly AUDIOCHANNELLABEL_TOPFRONTRIGHT: number;

    /**
     * 32 Channel Configuration Discrete Discrete Discrete Discrete Discrete Discrete Discrete Discrete Discrete Discrete Discrete Discrete Discrete Discrete Discrete Discrete Discrete Discrete Discrete Discrete Discrete Discrete Discrete Discrete Discrete Discrete Discrete Discrete Discrete Discrete Discrete Discrete
     */
    static readonly CHANNELLAYOUT_32_DISCRETE_CHANNELS: number;

    /**
     * 4 Channel Configuration Discrete Discrete Discrete Discrete
     */
    static readonly CHANNELLAYOUT_4_DISCRETE_CHANNELS: number;

    /**
     * 6 Channel Configuration Front-Left Front-Right Front-Center Low-Frequency Back-Left Back-Right
     */
    static readonly CHANNELLAYOUT_51: number;

    /**
     * 8 Channel Configuration Front-Left Front-Right Front-Center Low-Frequency Back-Left Back-Right Front-Left-Of-Center Front-Right-Of-Center
     */
    static readonly CHANNELLAYOUT_7_1: number;

    /**
     * 8 Channel Configuration Front-Left Front-Right Back-Left Back-Right Front-Center Low-Frequency Front-Left-Of-Center Front-Right-Of-Center
     */
    static readonly CHANNELLAYOUT_7_1EMAGIC: number;

    /**
     * 8 Channel Configuration Front-Left Front-Right Front-Center Low-Frequency Back-Left Back-Right Rear-Surround-Left Rear-Surround-Right
     */
    static readonly CHANNELLAYOUT_7_1ITU: number;

    /**
     * 8 Channel Configuration Front-Center Front-Left-Of-Center Front-Right-Of-Center Front-Left Front-Right Back-Left Back-Right Low-Frequency
     */
    static readonly CHANNELLAYOUT_7_1MPEG: number;

    /**
     * 8 Channel Configuration Discrete Discrete Discrete Discrete Discrete Discrete Discrete Discrete
     */
    static readonly CHANNELLAYOUT_8_DISCRETE_CHANNELS: number;

    /**
     * 4 Channel Configuration Ambisonic-W Ambisonic-X Ambisonic-Y Ambisonic-Z
     */
    static readonly CHANNELLAYOUT_AMBISONICSBFORMAT: number;

    /**
     * 2 Channel Configuration Bottom-Front-Left Bottom-Front-Right
     */
    static readonly CHANNELLAYOUT_BFL_BFR: number;

    /**
     * 6 Channel Configuration Front-Left  Front-Right Front-Center Low-Frequency Back-Left Back-Right
     */
    static readonly CHANNELLAYOUT_BROADCAST51: number;

    /**
     * 8 Channel Configuration Front-Left Front-Right Back-Left Back-Right Top-Front-Left Top-Front-Right Top-Back-Left Top-Back-Right
     */
    static readonly CHANNELLAYOUT_CUBE: number;

    /**
     * 2 Channel Configuration Front-Center Low-Frequency
     */
    static readonly CHANNELLAYOUT_C_LFE: number;

    /**
     * 3 Channel Configuration Front-Center Front-Left Front-Right
     */
    static readonly CHANNELLAYOUT_C_L_R: number;

    /**
     * 4 Channel Configuration Front-Center Front-Left Front-Right Back-Center
     */
    static readonly CHANNELLAYOUT_C_L_R_CS: number;

    /**
     * 5 Channel Configuration Front-Center Front-Left Front-Right Back-Left Back-Right
     */
    static readonly CHANNELLAYOUT_C_L_R_LS_RS: number;

    /**
     * 6 Channel Configuration Front-Center Front-Left Front-Right Back-Left Back-Right Back-Center
     */
    static readonly CHANNELLAYOUT_C_L_R_LS_RS_CS: number;

    /**
     * 7 Channel Configuration Front-Center Front-Left Front-Right Back-Left Back-Right Back-Center Low-Frequency
     */
    static readonly CHANNELLAYOUT_C_L_R_LS_RS_CS_LFE: number;

    /**
     * 6 Channel Configuration Front-Center Front-Left Front-Right Back-Left Back-Right Low-Frequency
     */
    static readonly CHANNELLAYOUT_C_L_R_LS_RS_LFE: number;

    /**
     * 7 Channel Configuration Front-Center Front-Left Front-Right Back-Left Back-Right Rear-Surround-Left Rear-Surround-Right
     */
    static readonly CHANNELLAYOUT_C_L_R_LS_RS_RLS_RRS: number;

    /**
     * 8 Channel Configuration Front-Center Front-Left Front-Right Back-Left Back-Right Rear-Surround-Left Rear-Surround-Right Back-Center
     */
    static readonly CHANNELLAYOUT_C_L_R_LS_RS_RLS_RRS_CS: number;

    /**
     * 6 Channel Configuration Front-Left Front-Right Back-Left Back-Right Front-Center Back-Center
     */
    static readonly CHANNELLAYOUT_HEXAGONAL: number;

    /**
     * 2 Channel Configuration Front-Left-Of-Center Front-Right-Of-Center
     */
    static readonly CHANNELLAYOUT_LC_RC: number;

    /**
     * 6 Channel Configuration Front-Left Front-Right Back-Left Back-Right Front-Center Low-Frequency
     */
    static readonly CHANNELLAYOUT_LEGACY51: number;

    /**
     * 2 Channel Configuration Side-Left Side-Right
     */
    static readonly CHANNELLAYOUT_LSD_RSD: number;

    /**
     * 2 Channel Configuration Back-Left Back-Right
     */
    static readonly CHANNELLAYOUT_LS_RS: number;

    /**
     * 3 Channel Configuration Front-Left Front-Center Front-Right
     */
    static readonly CHANNELLAYOUT_L_C_R: number;

    /**
     * 4 Channel Configuration Front-Left Front-Center Front-Right Back-Center
     */
    static readonly CHANNELLAYOUT_L_C_R_CS: number;

    /**
     * 5 Channel Configuration Front-Left Front-Center Front-Right Back-Center Low-Frequency
     */
    static readonly CHANNELLAYOUT_L_C_R_CS_LFE: number;

    /**
     * 4 Channel Configuration Front-Left Front-Center Front-Right Low-Frequency
     */
    static readonly CHANNELLAYOUT_L_C_R_LFE: number;

    /**
     * 5 Channel Configuration Front-Left Front-Center Front-Right Back-Left Back-Right
     */
    static readonly CHANNELLAYOUT_L_C_R_LS_RS: number;

    /**
     * 6 Channel Configuration Front-Left Front-Center Front-Right Back-Left Back-Right Low-Frequency
     */
    static readonly CHANNELLAYOUT_L_C_R_LS_RS_LFE: number;

    /**
     * 3 Channel Configuration Front-Left Front-Right Front-Center
     */
    static readonly CHANNELLAYOUT_L_R_C: number;

    /**
     * 3 Channel Configuration Front-Left Front-Right Back-Center
     */
    static readonly CHANNELLAYOUT_L_R_CS: number;

    /**
     * 4 Channel Configuration Front-Left Front-Right Back-Center Low-Frequency
     */
    static readonly CHANNELLAYOUT_L_R_CS_LFE: number;

    /**
     * 4 Channel Configuration Front-Left Front-Right Front-Center Back-Center
     */
    static readonly CHANNELLAYOUT_L_R_C_CS: number;

    /**
     * 4 Channel Configuration Front-Left Front-Right Front-Center Low-Frequency
     */
    static readonly CHANNELLAYOUT_L_R_C_LFE: number;

    /**
     * 5 Channel Configuration Front-Left Front-Right Front-Center Low-Frequency Back-Center
     */
    static readonly CHANNELLAYOUT_L_R_C_LFE_CS: number;

    /**
     * 7 Channel Configuration Front-Left Front-Right Front-Center Low-Frequency Back-Left Back-Right Back-Center
     */
    static readonly CHANNELLAYOUT_L_R_C_LFE_LS_RS_CS: number;

    /**
     * 9 Channel Configuration Front-Left Front-Right Front-Center Low-Frequency Back-Left Back-Right Back-Center Side-Left Side-Right
     */
    static readonly CHANNELLAYOUT_L_R_C_LFE_LS_RS_CS_LSD_RSD: number;

    /**
     * 14 Channel Configuration Front-Left Front-Right Front-Center Low-Frequency Back-Left Back-Right Back-Center Top-Center Top-Front-Left Top-Front-Center Top-Front-Right Top-Back-Left Top-Back-Center Top-Back-Right
     */
    static readonly CHANNELLAYOUT_L_R_C_LFE_LS_RS_CS_TS_VHL_VHC_VHR_TBL_TBR: number;

    /**
     * 9 Channel Configuration Front-Left Front-Right Front-Center Low-Frequency Back-Left Back-Right Front-Left-Of-Center Front-Right-Of-Center Back-Center
     */
    static readonly CHANNELLAYOUT_L_R_C_LFE_LS_RS_LC_RC_CS: number;

    /**
     * 8 Channel Configuration Front-Left Front-Right Front-Center Low-Frequency Back-Left Back-Right Side-Left Side-Right
     */
    static readonly CHANNELLAYOUT_L_R_C_LFE_LS_RS_LSD_RSD: number;

    /**
     * 10 Channel Configuration Front-Left Front-Right Front-Center Low-Frequency Back-Left Back-Right Side-Left Side-Right Left-Height Right-Height
     */
    static readonly CHANNELLAYOUT_L_R_C_LFE_LS_RS_LSD_RSD_TSL_TSR: number;

    /**
     * 8 Channel Configuration Front-Left Front-Right Front-Center Low-Frequency Back-Left Back-Right Proximity-Left Proximity-Right
     */
    static readonly CHANNELLAYOUT_L_R_C_LFE_LS_RS_PL_PR: number;

    /**
     * 12 Channel Configuration Front-Left Front-Right Front-Center Low-Frequency Back-Left Back-Right Top-Center Top-Front-Left Top-Front-Center Top-Front-Right Top-Back-Left Top-Back-Right
     */
    static readonly CHANNELLAYOUT_L_R_C_LFE_LS_RS_TS_VHL_VHC_VHR_TBL_TBR: number;

    /**
     * 11 Channel Configuration Front-Left Front-Right Front-Center Low-Frequency Back-Left Back-Right Top-Center Top-Front-Left Top-Front-Right Top-Back-Left Top-Back-Right
     */
    static readonly CHANNELLAYOUT_L_R_C_LFE_LS_RS_TS_VHL_VHR_TBL_TBR: number;

    /**
     * 10 Channel Configuration Front-Left Front-Right Front-Center Low-Frequency Back-Left Back-Right Top-Front-Left Top-Front-Right Top-Back-Left Top-Back-Right
     */
    static readonly CHANNELLAYOUT_L_R_C_LFE_LS_RS_VHL_VHR_TBL_TBR: number;

    /**
     * 5 Channel Configuration Front-Left Front-Right Front-Center Back-Left Back-Right
     */
    static readonly CHANNELLAYOUT_L_R_C_LS_RS: number;

    /**
     * 6 Channel Configuration Front-Left Front-Right Front-Center Back-Left Back-Right Back-Center
     */
    static readonly CHANNELLAYOUT_L_R_C_LS_RS_CS: number;

    /**
     * 8 Channel Configuration Front-Left Front-Right Front-Center Back-Left Back-Right Back-Center Side-Left Side-Right
     */
    static readonly CHANNELLAYOUT_L_R_C_LS_RS_CS_LSD_RSD: number;

    /**
     * 13 Channel Configuration Front-Left Front-Right Front-Center Back-Left Back-Right Back-Center Top-Center Top-Front-Left Top-Front-Center Top-Front-Right Top-Back-Left Top-Back-Center Top-Back-Right
     */
    static readonly CHANNELLAYOUT_L_R_C_LS_RS_CS_TS_VHL_VHC_VHR_TBL_TBR: number;

    /**
     * 7 Channel Configuration Front-Left Front-Right Front-Center Back-Left Back-Right Front-Left-Of-Center Front-Right-Of-Center
     */
    static readonly CHANNELLAYOUT_L_R_C_LS_RS_LC_RC: number;

    /**
     * 8 Channel Configuration Front-Left Front-Right Front-Center Back-Left Back-Right Front-Left-Of-Center Front-Right-Of-Center Back-Center
     */
    static readonly CHANNELLAYOUT_L_R_C_LS_RS_LC_RC_CS: number;

    /**
     * 7 Channel Configuration Front-Left Front-Right Front-Center Back-Left Back-Right Side-Left Side-Right
     */
    static readonly CHANNELLAYOUT_L_R_C_LS_RS_LSD_RSD: number;

    /**
     * 11 Channel Configuration Front-Left Front-Right Front-Center Back-Left Back-Right Top-Center Top-Front-Left Top-Front-Center Top-Front-Right Top-Back-Left Top-Back-Right
     */
    static readonly CHANNELLAYOUT_L_R_C_LS_RS_TS_VHL_VHC_VHR_TBL_TBR: number;

    /**
     * 10 Channel Configuration Front-Left Front-Right Front-Center Back-Left Back-Right Top-Center Top-Front-Left Top-Front-Right Top-Back-Left Top-Back-Right
     */
    static readonly CHANNELLAYOUT_L_R_C_LS_RS_TS_VHL_VHR_TBL_TBR: number;

    /**
     * 9 Channel Configuration Front-Left Front-Right Front-Center Back-Left Back-Right Top-Front-Left Top-Front-Right Top-Back-Left Top-Back-Right
     */
    static readonly CHANNELLAYOUT_L_R_C_LS_RS_VHL_VHR_TBL_TBR: number;

    /**
     * 3 Channel Configuration Front-Left Front-Right Low-Frequency
     */
    static readonly CHANNELLAYOUT_L_R_LFE: number;

    /**
     * 4 Channel Configuration Front-Left Front-Right Low-Frequency Back-Center
     */
    static readonly CHANNELLAYOUT_L_R_LFE_CS: number;

    /**
     * 5 Channel Configuration Front-Left Front-Right Low-Frequency Back-Left Back-Right
     */
    static readonly CHANNELLAYOUT_L_R_LFE_LS_RS: number;

    /**
     * 7 Channel Configuration Front-Left Front-Right Low-Frequency Back-Left Back-Right Side-Left Side-Right
     */
    static readonly CHANNELLAYOUT_L_R_LFE_LS_RS_LSD_RSD: number;

    /**
     * 9 Channel Configuration Front-Left Front-Right Low-Frequency Back-Left Back-Right Top-Front-Left Top-Front-Center Top-Front-Right Bottom-Front-Center
     */
    static readonly CHANNELLAYOUT_L_R_LFE_LS_RS_VHL_VHC_VHR_BFC: number;

    /**
     * 5 Channel Configuration Front-Left Front-Right Back-Left Back-Right Front-Center
     */
    static readonly CHANNELLAYOUT_L_R_LS_RS_C: number;

    /**
     * 7 Channel Configuration Front-Left Front-Right Back-Left Back-Right Front-Center Front-Left-Of-Center Front-Right-Of-Center
     */
    static readonly CHANNELLAYOUT_L_R_LS_RS_C_LC_RC: number;

    /**
     * 7 Channel Configuration Front-Left Front-Right Back-Left Back-Right Front-Center Rear-Surround-Left Rear-Surround-Right
     */
    static readonly CHANNELLAYOUT_L_R_LS_RS_C_RLS_RRS: number;

    /**
     * 5 Channel Configuration Front-Left Front-Right Back-Left Back-Right Low-Frequency
     */
    static readonly CHANNELLAYOUT_L_R_LS_RS_LFE: number;

    /**
     * 6 Channel Configuration Front-Left Front-Right Back-Left Back-Right Side-Left Side-Right
     */
    static readonly CHANNELLAYOUT_L_R_LS_RS_LSD_RSD: number;

    /**
     * 2 Channel Configuration Left-Total Right-Total
     */
    static readonly CHANNELLAYOUT_MATRIXSTEREO: number;

    /**
     * 1 Channel Configuration Discrete
     */
    static readonly CHANNELLAYOUT_MONO: number;

    /**
     * 8 Channel Configuration Front-Left Front-Right Back-Left Back-Right Front-Center Back-Center Side-Left Side-Right
     */
    static readonly CHANNELLAYOUT_OCTAGONAL: number;

    /**
     * 5 Channel Configuration Front-Left Front-Right Back-Left Back-Right Front-Center
     */
    static readonly CHANNELLAYOUT_PENTAGONAL: number;

    /**
     * 4 Channel Configuration Front-Left Front-Right Back-Left Back-Right
     */
    static readonly CHANNELLAYOUT_QUADRAPHONIC: number;

    /**
     * 16 Channel Configuration Discrete Discrete Front-Center Discrete Discrete Discrete Discrete Discrete Discrete Discrete Discrete Discrete Discrete Discrete Discrete Discrete
     */
    static readonly CHANNELLAYOUT_SMPTEDIGITALCINEMA1: number;

    /**
     * 16 Channel Configuration Left-Total Right-Total Discrete Discrete Discrete Discrete Discrete Discrete Discrete Discrete Discrete Discrete Discrete Discrete Discrete Discrete
     */
    static readonly CHANNELLAYOUT_SMPTEDIGITALCINEMA2: number;

    /**
     * 16 Channel Configuration Front-Left Front-Right Front-Center Discrete Back-Center Discrete Discrete Discrete Discrete Discrete Discrete Discrete Discrete Discrete Discrete Discrete
     */
    static readonly CHANNELLAYOUT_SMPTEDIGITALCINEMA4: number;

    /**
     * 16 Channel Configuration Front-Left Front-Right Front-Center Low-Frequency Back-Left Back-Right Discrete Discrete Discrete Discrete Discrete Discrete Discrete Discrete Discrete Discrete
     */
    static readonly CHANNELLAYOUT_SMPTEDIGITALCINEMA6: number;

    /**
     * 16 Channel Configuration Front-Left Front-Right Front-Center Low-Frequency Back-Left Back-Right Discrete Discrete Back-Center Discrete Discrete Discrete Discrete Discrete Discrete Discrete
     */
    static readonly CHANNELLAYOUT_SMPTEDIGITALCINEMA7: number;

    /**
     * 16 Channel Configuration Front-Left Front-Right Front-Center Low-Frequency Back-Left Back-Right Front-Left-Of-Center Front-Right-Of-Center Discrete Discrete Discrete Discrete Discrete Discrete Discrete Discrete
     */
    static readonly CHANNELLAYOUT_SMPTEDIGITALCINEMA8: number;

    /**
     * 16 Channel Configuration Front-Left Front-Right Front-Center Low-Frequency Back-Left Back-Right Front-Left-Of-Center Front-Right-Of-Center Back-Center Discrete Discrete Discrete Discrete Discrete Discrete Discrete
     */
    static readonly CHANNELLAYOUT_SMPTEDIGITALCINEMA9: number;

    /**
     * 8 Channel Configuration Front-Left Front-Right Front-Center Low-Frequency Back-Left Back-Right Left-Total Right-Total
     */
    static readonly CHANNELLAYOUT_SMPTEDTV: number;

    /**
     * 2 Channel Configuration Front-Left Front-Right
     */
    static readonly CHANNELLAYOUT_STEREO: number;

    /**
     * 2 Channel Configuration Top-Back-Left Top-Back-Right
     */
    static readonly CHANNELLAYOUT_TBL_TBR: number;

    /**
     * 2 Channel Configuration Left-Height Right-Height
     */
    static readonly CHANNELLAYOUT_TSL_TSR: number;

    /**
     * 2 Channel Configuration Top-Front-Left Top-Front-Right
     */
    static readonly CHANNELLAYOUT_VHL_VHR: number;

    /**
     * 12 Channel Configuration Front-Left Front-Right Front-Center Low-Frequency Back-Left Back-Right Top-Front-Left Top-Front-Center Top-Front-Right Top-Back-Left Top-Back-Right LFE2
     */
    static readonly CHANNELLAYOUT_VST10_2: number;

    /**
     * 14 Channel Configuration Front-Left Front-Right Front-Center Low-Frequency Back-Left Back-Right Front-Left-Of-Center Front-Right-Of-Center Top-Front-Left Top-Front-Center Top-Front-Right Top-Back-Left Top-Back-Right LFE2
     */
    static readonly CHANNELLAYOUT_VST10_2_PLUS: number;

    /**
     * 8 Channel Configuration Front-Left Front-Right Front-Center Low-Frequency Back-Left Back-Right Back-Center Top-Front-Center
     */
    static readonly CHANNELLAYOUT_VST_7_1_CINE_CENTER_HIGH: number;

    /**
     * 8 Channel Configuration Front-Left Front-Right Front-Center Low-Frequency Back-Left Back-Right Top-Front-Left Top-Front-Right
     */
    static readonly CHANNELLAYOUT_VST_7_1_CINE_FRONT_HIGH: number;

    /**
     * 8 Channel Configuration Front-Left Front-Right Front-Center Low-Frequency Back-Left Back-Right Left-Height Right-Height
     */
    static readonly CHANNELLAYOUT_VST_7_1_CINE_SIDE_HIGH: number;

    /**
     * 8 Channel Configuration Front-Left Front-Right Front-Center Low-Frequency Back-Left Back-Right Back-Center Top-Center
     */
    static readonly CHANNELLAYOUT_VST_7_1_CINE_TOP_CENTER: number;

    /**
     * Returns an audio channel label.
     */
    readonly [index: number]: number;

    /**
     * Audio channel layout description
     */
    readonly description: string;

    /**
     * Number of audio channels.
     */
    readonly length: number;

    /**
     * Create a audio channel layout.
     */
    static createAudioChannelLayout(labels: number[]): AudioChannelLayout;

    /**
     * Create a common audio channel layout.
     */
    static createCommonAudioChannelLayout(layout: number): AudioChannelLayout;

    /**
     * Returns an audio channel label.
     */
    getByIndex(index: number): number;

    /**
     * Get the number of audio channels.
     */
    getLength(): number;

    /**
     * Label string of a single audio channel label
     */
    static label(label: number): string;
}

/**
 * AudioChannelMapping class
 */
declare class AudioChannelMapping {

    audioChannelsType: number;
    audioClipsNumber: number;
    setMappingForChannel(channelIndex: number, sourceChannelIndex: number): boolean;
}

/**
 * An audio filter
 */
declare class AudioFilterModule {

    /**
     * Cast an object to AudioFilterModule. In case the provided object can be used as AudioFilterModule, a corresponding object is returned. Otherwise, an exception is thrown.
     */
    static castOrThrow(object: object): AudioFilterModule;

    /**
     * Get whether the filter is internal.
     */
    isInternal(): boolean;

    /**
     * Cast an object to AudioFilterModule. In case the provided object can be used as AudioFilterModule, a corresponding object is returned. Otherwise, null is returned.
     * @returns AudioFilterModule | null
     */
    static queryCast(object: object): AudioFilterModule | null;
}

/**
 * The AudioFilterProcessor object provides methods to apply audio filters to wave files and to comopare the results against a baseline.
 */
declare class AudioFilterProcessor {

    /**
     * Compare an input file against a baseline and return the maximum difference.
     */
    static compare(input: WaveFile, baseline: WaveFile): object;

    /**
     * Get all factory preset names for the specified audio filter.
     */
    static getPresetsForAudioFilter(audioFilter: string): string[];

    /**
     * Is the specified audio channel layout supported by the specified audio filter?
     */
    static isAudioChannelLayoutSupportedByAudioFilter(audioChannelLayout: AudioChannelLayout, audioFilter: string): boolean;

    /**
     * Apply a specified preset of an audio filter to an input file and write the result to disk again.
     */
    static process(audioFilter: string, preset: string, input: WaveFile, outputs: WaveFile[]): object;

    /**
     * Get the output bus names for an audio filter when applied to the provided audio channel layout.
     */
    static getOutputBusNames(audioFilter: string, audioChannelLayout: AudioChannelLayout): string[];
}

/**
 * Scripting methods to the Batch
 */
declare class Batch {

    static addEventListener(): any;
    static dispatchEvent(): any;
    static removeEventListener(): any;

    /**
     * Start listening for batch events.
     */
    static startListening(): boolean;
}

/**
 * BatchEncoder event object
 */
declare class BatchEncoderEvent {

    /**
     * Sent when the batch encoder status is changed.
     */
    static readonly EVENT_ENCODER_STATUS_CHANGED: string;

    /**
     * Sent when Description message is updated.
     */
    static readonly EVENT_ENCODINGITEM_DESCRIPTION: string;

    /**
     * Reflects an sdk error event that has come in pertaining to this batch item, as we surmise.
     */
    static readonly EVENT_ENCODINGITEM_EVENT: string;

    /**
     * Send on a progress update for an Item.
     */
    static readonly EVENT_ENCODINGITEM_PROGRESS_UPDATE: string;

    /**
     * Sent after a new item starts encoding.
     */
    static readonly EVENT_ENCODINGITEM_STARTED: string;

    /**
     * Sent when encoding is complete.
     */
    static readonly EVENT_ENCODING_COMPLETE: string;

    /**
     * Sent after a paused item starts encoding.
     */
    static readonly EVENT_ENCODING_PAUSED_ITEM_STARTED: string;

    /**
     * A generic progress message that can be sent for operations after encoding with progress.
     */
    static readonly EVENT_ENCODING_POST_OPERATION_PROGRESS: string;

    /**
     * A generic progress message that can be sent for operations before encoding.
     */
    static readonly EVENT_ENCODING_PRE_OPERATION_PROGRESS: string;

    /**
     * Sent when Media Info is created.
     */
    static readonly EVENT_MEDIA_INFO_CREATED: string;

    /**
     * On encoding completion this indicates whether a source can be moved, otherwise false.
     */
    readonly allowMoveSource: boolean;

    /**
     * Return the message related batchitem. Otherwise empty.
     */
    readonly batchItem: object;

    /**
     * Get the current event flag for an event message. Zero if unset.
     */
    readonly eventFlag: number;

    /**
     * The current progress, negative if unknown or invalid (-1).
     */
    readonly progress: number;

    /**
     * A text or event message if required by this event. Otherwise empty.
     */
    readonly textMessage: string;

    static addEventListener(): any;
    static dispatchEvent(): any;
    static removeEventListener(): any;
}

/**
 * Scripting methods to batch encoder
 */
declare interface BatchEncoderScriptObject {
}

/**
 * Batch event object
 */
declare class BatchEvent {

    /**
     * Sent when a batch group is added.
     */
    static readonly BATCH_GROUP_INSERTED: string;

    /**
     * Sent when a batch group is removed.
     */
    static readonly BATCH_GROUP_REMOVED: string;

    /**
     * Sent when a batch item is added.
     */
    static readonly BATCH_ITEM_INSERTED: string;

    /**
     * Sent when a batch item is removed.
     */
    static readonly BATCH_ITEM_REMOVED: string;

    /**
     * Return the message related batch. Otherwise empty.
     */
    readonly batchGroupID: string;

    /**
     * A text or event message if required by this event. Otherwise empty.
     */
    readonly batchItemID: string;

    static addEventListener(): any;
    static dispatchEvent(): any;
    static removeEventListener(): any;
}

/**
 * Scripting methods to the Batch Item Group
 */
declare interface BatchItemGroup {

    /**
     * List of all contained BatchItemScriptObjects.
     */
    readonly batchItems: Array<any>;

    /**
     * Progress of complete batch group (calculated from the progress of all contained batch items) in percent.
     */
    readonly combinedProgress: number;

    /**
     * Rendering status of the complete batch group.
     */
    readonly combinedStatus: number;

    /**
     * GUID of the batch item group.
     */
    readonly id: string;

    /**
     * JSON of all post-processor items of the current batch item group.
     */
    readonly postProcessorItemsJSON: string;

    /**
     * JSON of the current source settings.
     */
    readonly sourceInfo: string;
}

/**
 * BetaFeature class
 */
declare class BetaFeature {

    /**
     * Feature Flag follows default.
     */
    static readonly FEATURE_FLAG_OVERRIDE_DEFAULT: number;

    /**
     * Feature Flag turned off.
     */
    static readonly FEATURE_FLAG_OVERRIDE_OFF: number;

    /**
     * Feature Flag turned on.
     */
    static readonly FEATURE_FLAG_OVERRIDE_ON: number;

    /**
     * Returns true if the entitlement is set to indicate an internal user.
     */
    static readonly isEntitlementSetToInternalFeaturesAllowed: boolean;

    /**
     * Returns true if a beta feature is enabled.
     */
    static isFeatureEnabled(featureID: string): boolean;

    /**
     * Check to see if a feature is overridden by Floodgate. If it is, then use the value according to the set floodgate configuration of the feature. If the feature is not overridden, this will fall back on the underlying Beta Feature value
     */
    static isFeatureEnabledFloodgate(featureID: string): boolean;

    /**
     * Set beta feature to enabled | disabled. Returns true if override was set successfully.
     */
    static setFeatureFlagOverride(featureID: string, uArg1: number): boolean;
}

/**
 * Represents captioning metadata of caption tracks
 */
declare interface CaptioningMetadata {

    /**
     * Returns true if the given CaptioningMetadata is equal to this CaptioningMetadata object
     */
    equals(metadata: CaptioningMetadata): boolean;
}

/**
 * The ClientInfo object provides information about the application.
 */
declare class ClientInfo {

    /**
     * Application name
     */
    static readonly application: string;

    /**
     * True when app is being branded and named as beta-prime
     */
    static readonly betaPrime: boolean;

    /**
     * Build number
     */
    static readonly build: string;

    /**
     * Client name
     */
    static readonly client: string;

    /**
     * Company name
     */
    static readonly company: string;

    /**
     * Returns true if running in automation environment
     */
    static readonly isRunningAutomation: boolean;

    /**
     * Patch number
     */
    static readonly patch: string;

    /**
     * File path to the ScriptingAPIManifest.json resource
     */
    static readonly scriptingAPIManifestPath: string;

    /**
     * Scripting host name
     */
    static readonly scriptingHost: string;

    /**
     * Version string
     */
    static readonly version: string;

    /**
     * Long version string
     */
    static readonly versionInternal: string;

    /**
     * Returns the full version string (Major.Minor.Patch.Build)
     */
    static getAppFullVersion(): string;

    /**
     * Get Application Location.
     */
    static getAppLocation(): string;

    /**
     * Get Application Preference Path
     */
    static getAppPrefPath(): string;
}

/**
 * Event will be triggered when there is a change in any job owned by the logged-in User.
 */
declare interface CloudDispatcherJobChangeEvent {

    /**
     * Timestamp of estimated completion of this job.
     */
    readonly jobEstimatedCompletion: string;

    /**
     * ID of the job.
     */
    readonly jobID: string;

    /**
     * Name of the job.
     */
    readonly jobName: string;

    /**
     * Job progress.
     */
    readonly jobProgress: number;

    /**
     * State of the job.
     */
    readonly jobState: string;
}

/**
 * Event will be triggered when there is a login completion
 */
declare interface CloudDispatcherObjectLoginEvent {

    /**
     * Active region
     */
    readonly region: string;
}

/**
 * Event will be triggered after cloud queue list object has been loaded successfully or failed
 */
declare interface CloudQueueListObjectLoadEvent {
}

/**
 * Event will be triggered after cloud queue object has been loaded successfully or failed.
 */
declare interface CloudQueueObjectLoadEvent {
}

/**
 * Object containing cluster information from clustering algorithms.
 */
declare interface Clusters {

    /**
     * Total number of clusters found.
     */
    readonly numClusters: number;

    /**
     * Gets the centroid of a specific cluster.
     */
    centroid(clusterIndex: number): object;

    /**
     * Gets the member indices for a specific cluster.
     */
    memberIndices(clusterIndex: number): number[];
}

/**
 * Color class
 */
declare class Color {

    /**
     * Read|Write property to get|set alpha value of color object
     */
    alpha: number;

    /**
     * Read|Write property to get|set blue value of color object
     */
    blue: number;

    /**
     * Read|Write property to get|set green value of color object
     */
    green: number;

    /**
     * Read|Write property to get|set red value of color object
     */
    red: number;

    /**
     * Construct a Color Object with parameters for Red, Green, Blue, and Alpha values which are in range [0.0-1.0]
     */
    constructor(Red: number, Green: number, Blue: number, Alpha: number);

    /**
     * Returns true if the given ColorObject is equal to this ColorObject
     */
    equals(colorObject: Color): boolean;
}

/**
 * ColorAccuracyObject exposes various helpful scripting functions which help calculate the color accuracy for two provided MF::IVideoFrameRef
 */
declare class ColorAccuracy {

    /**
     * Delta ITP value for the given two reference video frames
     */
    static deltaITP(VideoFrame: object, VideoFrame2: object, uArg1: number[], uArg2: number[], uArg3: number): number[];

    /**
     * Get ITP values for the given video frame on specific test points
     */
    static getITPValuesForTestPoints(VideoFrame: object, uArg1: number[], uArg2: number[], uArg3: number): number[];
}

/**
 * ColorProfile class
 */
declare class ColorProfileObject {

    /**
     * Read property to get Profile name
     */
    readonly getProfileName: string;

    /**
     * Construct a ColorProfileObject Object from ColorProfile name
     */
    constructor(Name: string);

    /**
     * Returns true if the given ColorProfileObject is equal to this ColorProfileObject
     */
    equals(colorProfileObject: ColorProfileObject): boolean;
}

/**
 * ColorSpaceObject exposes various helpful scripting functions which are useful when working with color spaces
 */
declare class ColorSpace {

    /**
     * Is the color space empty
     */
    readonly empty: boolean;

    /**
     * Is the color space scene referred
     */
    readonly isSceneReferred: boolean;

    /**
     * The color matrix equation code associated with the color space
     */
    readonly matrixEquation: number;

    /**
     * The name of the associated color space
     */
    readonly name: string;

    /**
     * The color primaries code associated with the color space
     */
    readonly primaries: number;

    /**
     * The color transfer characteristic code associated with the color space
     */
    readonly transferCharacteristic: number;

    /**
     * Get Color Space Peak Luminance
     */
    getPeakLuminance(): number;

    /**
     * Set Color Space Peak Luminance
     */
    setPeakLuminance(uArg1: number): boolean;
}

/**
 * ColorSpaceMetaData class
 */
declare class ColorSpaceMetaDataObject {

    /**
     * Read|Write property to get|set DataRangeInfoValid
     */
    dataRangeInfoValid: boolean;

    /**
     * Read|Write property to get|set peak luminance
     */
    peakLuminance: number;

    /**
     * Construct a ColorSpaceMetaData Object with parameters for PeakLuminance and DataRangeInfoValid values
     */
    constructor(PeakLuminance: number, DataRangeInfoValid: boolean);

    /**
     * Returns true if the given ColorSpaceMetaDataObject is equal to this ColorSpaceMetaDataObject
     */
    equals(colorSpaceMetaDataObject: ColorSpaceMetaDataObject): boolean;
}

/**
 * ColorSpace class
 */
declare class ColorSpaceObject {

    /**
     * Read property to get Profile Type
     */
    readonly getBaseProfileType: number;

    /**
     * Read property to get Profile Type
     */
    readonly getIsLinear: boolean;

    /**
     * Construct a ColorSpaceObject Object from ColorSpaceObject name
     */
    constructor(ColorSpaceMetaData: object, ColorProfile: object, ColorBaseProfileType: number, IsLinear: boolean);

    /**
     * Returns true if the given ColorProfileObject is equal to this ColorProfileObject
     */
    equals(colorProfileObject: ColorProfileObject): boolean;

    /**
     * Get ColorProfile Object
     */
    getColorProfile(): object;

    /**
     * Get ColorSpaceMetaData Object
     */
    getColorSpaceMetaData(): object;
}

/**
 * An object represent the dvacore::debug::CodeProfiler mechanism on ExtendScript.
 */
declare class CommonDirs {

    /**
     * On Windows, the directory the app was launched in. On Mac, the directory <app bundle>/Contents/MacOS
     */
    static readonly executableDir: string;

    /**
     * On Windows, the path to the .exe file. On Mac, the path to the .app bundle.
     */
    static readonly mainExecutableFile: string;

    /**
     * On Windows, the directory Plug-ins next to the executable. On Mac, the directory <app bundle>/Contents/Plug-ins.
     */
    static readonly pluginsDir: string;

    /**
     * On Windows, the directory the app was launched in. On Mac, the directory <app bundle>/Contents/Resources
     */
    static readonly resourcesDir: string;
}

/**
 * Component class
 */
declare class Component {

    readonly displayName: string;
    readonly instanceName: string;
    readonly matchName: string;
    readonly properties: ComponentParamCollection;
}

/**
 * ComponentCollection class
 */
declare interface ComponentCollection {

    /**
     * Returns the number of components.
     */
    readonly numItems: number;

    /**
     * Returns a component object.
     */
    readonly [index: number]: Component;

    /**
     * Returns the number of components.
     */
    readonly length: number;
}

/**
 * ComponentParam class
 */
declare class ComponentParam {

    readonly displayName: string;
    /**
     * Adds a keyframe at the specified time. You must use the time within the clip, not the sequence.
     * @param time Can be a {@link Time} object, a number for seconds, or a string for ticks
     * @param updateUI If `true`, the UI will be updated after adding the keyframe.
     */
    addKey(time: Time | number | string, updateUI?: boolean): boolean
    areKeyframesSupported(): boolean;
    /**
     * Gets the time of the nearest keyframe to the specified time, within the given threshold. You must use the time within the clip, not the sequence.
     * @param timeToCheck Can be a {@link Time} object, a number for seconds, or a string for ticks
     * @param threshold Can be a {@link Time} object, a number for seconds, or a string for ticks
     * @returns A {@link Time} object representing the nearest keyframe, or `undefined` if no keyframe is found within the threshold.
     */
    findNearestKey(timeToCheck: Time | string | number, threshold: Time | string | number): Time | undefined
    findNextKey(timeToCheck: Time | string | number): Time | undefined
    findPreviousKey(timeToCheck: Time | string | number): Time

    /**
     * Gets this color parameter's value as [alpha, red, green, blue], each an integer 0–255 (the same order setColorValue takes).
     * Returns an empty array if the parameter isn't bound to anything.
     * Same caveat as setColorValue: on a non-color parameter it dereferences a null pointer.
     */
    getColorValue(): number[];

    /**
     * Get the time of all keys in the component parameter.
     * @returns An array of {@link Time} objects representing the times of all keys, or `undefined` if there are no keys or it's not time-varying.
     */
    getKeys(): Time[] | undefined

    /**
     * Gets the value of the component parameter. It may be a single value or an array of values, depending on the parameter type.
     */
    getValue(): boolean;

    getValueAtKey(time: Time): boolean;
    getValueAtTime(time: Time): boolean;
    isEmpty(): boolean;
    isTimeVarying(): boolean;

    /**
     * Checks if a key exists at the specified time. You must use the time within the clip, not the sequence.
     * @param time Can be a {@link Time} object, a number for seconds, or a string for ticks
     * @returns `true` if a key exists at the specified time, `false` otherwise.
     */
    keyExistsAtTime(time: Time | number | string): boolean

    removeKey(time: Time): boolean
    removeKeyRange(start: Time, end: Time): boolean

    /**
     * Sets this color parameter's value. Not undoable.
     * Only use it on color parameters: it doesn't check the type, and on any other parameter it dereferences a null pointer (expect a crash).
     * @param alpha 0–255. Premiere's own UI always writes 255 here and ignores it when reading.
     * @param red 0–255
     * @param green 0–255
     * @param blue 0–255. Out-of-range values are clamped to 0–255.
     * @param updateUI Optional, default false. true broadcasts the change notifications so panels refresh; false sets the value but drops the notifications.
     * @returns Always true.
     */
    setColorValue(alpha: number, red: number, green: number, blue: number, updateUI?: boolean): boolean;

    /**
     * Set the interpolation type for a keyframe at the specified time.
     * @param interpolationType See {@link InterpolationType}
     * @param updateUI If `true`, the UI will be updated after setting the interpolation type.
     */
    setInterpolationTypeAtKey(time: Time, interpolationType: InterpolationType, updateUI?: boolean): boolean
    setTimeVarying(setTimeVarying: boolean, uArg2?: boolean): boolean;
    setValue(value: any, updateUI?: boolean | number): boolean
    /**
     * Sets the keyframe value of a the component parameter at a specific time. A keyframe must already exist at that time.
     * Check using {@link areKeyframesSupported()} before calling this method. And a keyframe can be added using {@link addKey()}.
     * @param time
     * @param value New value to set at the keyframe
     * @param updateUI 1 to update the UI after setting the value, 0 to not update the UI
     */
    setValueAtKey(time: Time, value: any, updateUI?: boolean | number): boolean
}

/**
 * ComponentParamCollection class
 */
declare interface ComponentParamCollection {

    /**
     * Returns the number of component parameters.
     */
    readonly numItems: number;

    getParamForDisplayName(paramName: string): ComponentParam | null

    /**
     * Returns a component param object.
     */
    readonly [index: number]: ComponentParam;

    /**
     * Returns the number of component parameters.
     */
    readonly length: number;
}

/**
 * The Console object provides access to the DVA console.
 */
declare class Console {

    /**
     * Executes a console command whose feedback is returned as string. Throws an error if the command could not be found.
     */
    static execute(command: string): string;

    /**
     * Output on console
     */
    static print(text: string, lf: boolean): boolean;
}

/**
 * Event will be triggered when file transfer has been completed.
 */
declare interface CopyToSharedStorageCompleteEventObject {

    /**
     * Returns the error code.
     */
    readonly errorCode: number;

    /**
     * Returns the error message.
     */
    readonly errorMessage: string;

    /**
     * Returns the media file path.
     */
    readonly mediaFilePath: string;

    /**
     * Returns the media locator identifier.
     */
    readonly mediaLocatorID: string;

    /**
     * Returns the production identifier.
     */
    readonly productionID: string;

    /**
     * Returns the transfer target path.
     */
    readonly targetPath: string;

    /**
     * Returns the transfer status (Successful, Cancelled, Failed, Paused, Running, Waiting).
     */
    readonly transferStatus: string;
}

/**
 * Event will be triggered when an AME render job hasn't been created successfully or failed.
 */
declare interface CreateRemoteAMERenderJobEvent {
}

/**
 * DebugAssert class provides the ability to log debug asserts in scripting.
 */
declare class DebugAssert {

    /**
     * Get log (as a dictionary object) of all asserts hit during receive period
     */
    static getLog(): string[];

    /**
     * Start logging all asserts hit during receive period
     */
    static startLog(): boolean;
}

/**
 * DebugDatabase class provides access to debug database.
 */
declare class DebugDatabase {

    /**
     * Get value for a key.
     */
    static get(key: string): string;

    /**
     * Get the master list of all debug flags
     */
    static getDebugFlagMasterList(): object;

    /**
     * Gets the default value for an entry
     */
    static getDefault(key: string): string;

    /**
     * Get value for a boolean key(if present) or return given default value
     */
    static getOrDefaultBoolValue(key: string, defaultValue: boolean): boolean;

    /**
     * Get value for a key(if present) or return given default value
     */
    static getOrDefaultValue(key: string, defaultValue: string): string;

    /**
     * Checks if an entry exists for the given key
     */
    static hasKey(key: string): boolean;

    /**
     * Checks if an entry's value is the default value or not
     */
    static isDefault(key: string): boolean;

    /**
     * Sets a value for a given key in Debug Database.
     */
    static set(key: string, value: string): boolean;
}

/**
 * DebugMonitor script object
 */
declare class DebugMonitor {

    /**
     * removes category from opened category list
     */
    closeCategory(categoryId: string): boolean;

    /**
     * constructor for debug monitor
     */
    constructor();

    /**
     * Get debug information for an identifier
     */
    getDebugInformation(categoryId: string): string;

    /**
     * Get all the debug categories
     */
    getDebugMonitorCategories(): any;

    /**
     * get debug info of opened category of debug monitor
     */
    getOpenedListDebugInfo(): any[];

    /**
     * inserts category in opened category list
     */
    openCategory(categoryId: string): boolean;
}

/**
 * Document class
 */
declare class Document {

    bind(eventName: string, function_: any): void

    getFilePath(): string;
    importFiles(uArg1: string[], uArg2: boolean, uArg3: boolean): boolean;
    setTimeout(eventName: string, function_: any, milliseconds: number): void
    unbind(eventName: string): void
    getDocumentState(): string;
}

/**
 * Event will be triggered when EA login completes.
 */
declare interface EALoginCompletedEventObject {

    /**
     * Returns EA Login result.
     */
    readonly eaLoginResult: boolean;
}

/**
 * Event will be triggered after authentication failure.
 */
declare interface EAObjectOnAuthenticationFailureEvent {
}

/**
 * Event will be triggered after authentication success.
 */
declare interface EAObjectOnAuthenticationSuccessEvent {
}

/**
 * High level interface object that gives access to the EmbeddingStorage
 */
declare class EmbeddingStorage {

    /**
     * Close the open index for the given scope node and return the number of closed indexes
     * @returns Close count
     */
    closeScope(node: object): any;

    /**
     * Get an object representing the embedding storage
     */
    static getInstance(): object;
}

/**
 * Event will be triggered when encoding has been canceled.
 */
declare interface EncodeCancelledEvent {
}

/**
 * Event will be triggered when encoding has been finished.
 */
declare interface EncodeErrorEvent {
}

/**
 * Event will be triggered when encoding has been finished.
 */
declare interface EncodeFinishedEvent {

    /**
     * Return absolute path of encoded file.
     */
    readonly path: string;
}

/**
 * Encoder class
 */
declare class Encoder {

    readonly ENCODE_ENTIRE: number;
    readonly ENCODE_IN_TO_OUT: number;
    readonly ENCODE_WORKAREA: number;
    bind(eventName: EncoderEvent, function_: any): void

    encodeFile(inputFilePath: string, outputFilePath: string, presetPath: string, removeOnCompletion?: number, startTime?: object, stopTime?: object): string | undefined;
    encodeProjectItem(projectItem: ProjectItem, outputFilePath: string, presetPath: string, WorkAreaType?: number, removeOnCompletion?: boolean, uArg3?: boolean): string;
    encodeSequence(sequence: Sequence, outputFilePath: string, presetPath: string, WorkAreaType?: number, removeOnCompletion?: boolean, uArg3: boolean): string;

    getExporters(): Array<any>;
    launchEncoder(): boolean;

    setEmbeddedXMPEnabled(enable: boolean): boolean;
    setSidecarXMPEnabled(enable: boolean): boolean;
    setTimeout(eventName: string, function_: any, milliseconds: number): void
    startBatch(): boolean;

    lastExportMediaFolder(): string;
    unbind(eventName: string): void

    /**
     * Export sequence using presetObject from Premiere Pro
     */
    exportWithPresetObject(outputFilePath: string, EncoderPreset: object, Sequence: object, uArg1: boolean): boolean;

    /**
     * Get Encoder Preset Object IPresetRef
     */
    getPresetObject(presetPath: string): EncoderPreset;
    selectFolder(): string;
}

/**
 * EncoderEventObject class
 */
declare interface EncoderEventObject {

    readonly errorString: string;
    readonly jobID: string;
    readonly launchSuccess: boolean;
    readonly outputFile: string;
    readonly progress: number;
}

/**
 * EncoderPreset class
 */
declare interface EncoderPreset {

    readonly id: string;
    readonly matchName: string;
    readonly name: string;

    /**
     * Override any export paramater value for preset object.
     */
    setExportParamValue(paramString: string, presetParamValue: string): boolean;

    writeToFile(filePath: string): boolean;
}

/**
 * Queue item object to set encode properties
 */
declare interface EncoderWrapper {

    /**
     * Gets the list of files the encode generated
     */
    readonly outputFiles: string[];

    /**
     * Gets the height of the encoded output file
     */
    readonly outputHeight: number;

    /**
     * Gets the width of the encoded output file
     */
    readonly outputWidth: number;

    /**
     * Toggle the inclusion of source XMP [boolean] input value required
     */
    SetIncludeSourceXMP(includeSourceXMP: boolean): boolean;

    /**
     * Returns the encode progress as percentage
     */
    getEncodeProgress(): number;

    /**
     * Return the encode time in milliseconds
     */
    getEncodeTime(): number;

    /**
     * Returns the log output including possible warnings and errors (available since 23.2.).
     */
    getLogOutput(): string;

    /**
     * Returns a list of missing assets
     * @param includeSource Get missing asset list from the source group if requested
     */
    getMissingAssets(includeSource: boolean, includeOutput: boolean): string[];

    /**
     * Returns the presets available for the assigned format
     */
    getPresetList(): string[];

    /**
     * Changes the format for the batch item
     * @param format E.g. 'H.264' Loads all presets available for the assigned format
     */
    loadFormat(format: string): boolean;

    /**
     * Loads and assigns the preset to the batch item
     */
    loadPreset(presetPath: string): boolean;

    /**
     * Sets the crop offsets
     */
    setCropOffsets(left: number, top: number, right: number, bottom: number): boolean;

    /**
     * Sets the crop state [boolean] input value required
     */
    setCropState(cropState: boolean): boolean;

    /**
     * Sets the scale type
     * @param cropType 0 ScaleToFit, 1 ScaleToFitBeforeCrop, 2 SetAsOutputSize, 3 ScaleToFill, 4 ScaleToFillBeforeCrop, 5 StretchToFill, 6 StretchToFillBeforeCrop
     */
    setCropType(cropType: number): boolean;

    /**
     * Sets the cue point data
     */
    setCuePointData(inCuePointsFilePath: string): boolean;

    /**
     * Sets the frame rate for the batch item
     * @param framerate E.g. '24' as string
     */
    setFrameRate(framerate: string): boolean;

    /**
     * Toggle the inclusion of cue points [boolean] input value required
     */
    setIncludeSourceCuePoints(includeSourceCuePoints: boolean): boolean;

    /**
     * Sets the output frame size
     */
    setOutputFrameSize(width: number, height: number): boolean;

    /**
     * Sets the rotation (in a 360 degree system)
     * @param rotationValue E.g. 0.0 - 360.0
     */
    setRotation(rotationValue: number): boolean;

    /**
     * Sets the scale type
     * @param scaleType 0 ScaleToFit, 1 ScaleToFitBeforeCrop, 2 SetAsOutputSize, 3 ScaleToFill, 4 ScaleToFillBeforeCrop, 5 StretchToFill, 6 StretchToFillBeforeCrop
     */
    setScaleType(scaleType: number): boolean;

    /**
     * Set the time interpolation type
     * @param interpolationType 0 FrameSampling, 1 FrameBlending, 2 OpticalFlow
     */
    setTimeInterpolationType(interpolationType: number): boolean;

    /**
     * Toggle the use of frame blending [boolean] input value required
     */
    setUseFrameBlending(useFrameBlending: boolean): boolean;

    /**
     * Toggle the use of maximum render quality [boolean] input value required
     */
    setUseMaximumRenderQuality(useMaximumRenderQuality: boolean): boolean;

    /**
     * Toggle the use of previews files. [boolean] input value required
     */
    setUsePreviewFiles(usePreviewFiles: boolean): boolean;

    /**
     * Sets the work area type, start and end time for the batch item
     * @param workAreaType 0 Entire, 1 InToOut, 2 WorkArea, 3 Custom, 4 UseDefault
     */
    setWorkArea(workAreaType: number, startTime: number, endTime: number): boolean;

    /**
     * Sets the work area type, start and end time in ticks for the batch item (available since 23.3)
     * @param workAreaType 0 Entire, 1 InToOut, 2 WorkArea, 3 Custom, 4 UseDefault
     */
    setWorkAreaInTicks(workAreaType: number, startTime: string, endTime: string): boolean;

    /**
     * Sets XMP data to given template
     */
    setXMPData(templateXMPFilePath: string): boolean;
}

/**
 * An event to inform of encode progress and completion.
 */
declare class EncoderWrapperEvent {

    /**
     * Returns the audio pre-encoding info for the event type onAudioPreEncodeProgress (available since 24.0).
     */
    readonly audioInfo: string;

    /**
     * Returns the audio pre-encoding progress for the event type onAudioPreEncodeProgress (available since 24.0).
     */
    readonly audioProgress: string;

    /**
     * Notify when the audio pre-encode progress changes (available since 24.0).
     */
    static readonly onAudioPreEncodeProgress: string;

    /**
     * Notify when the batch item has been encoded.
     */
    static readonly onEncodeFinished: string;

    /**
     * Notify when the batch item encode progress changes.
     */
    static readonly onEncodeProgress: string;

    /**
     * Returns the encoding result 'Done!', 'Failed!' or 'Stopped!' for the event type onEncodeFinished resp. the encoding progress for the event type onEncodeProgress which is between 0 and 100.
     */
    readonly result: string;

    static addEventListener(): any;
    static dispatchEvent(): any;
    static removeEventListener(): any;
}

/**
 * Supports installing and importing Motion Graphics Templates
 */
declare class EssentialGraphicsUtils {

    /**
     * Install a Motion Graphics Template (MOGRT) to the default location. On win that's e.g. C:\Users\[username]\AppData\Roaming\Adobe\Common\Motion Graphics Templates . When the argument subFolderPath isn't empty a folder of that name will be created and the MOGRT will be copied to that folder.
     */
    static installMOGRT(sourcePath: string, subFolderPath: string): string;

    /**
     * Check if the input Mogrt was authored in AE
     */
    static isAEMogrt(sourcePath: string): number[];
}

/**
 * The Export Utilities object provides the main access for export utilities.
 */
declare interface ExportFS {

    /**
     * Return the last used export folder path.
     */
    readonly getLastExportFolder: string;

    /**
     * Return the last used folder path.
     */
    readonly lastSelectedFolder: string;

    /**
     * If the file does not exist return filePath, otherwise return modified filePath in order to avoid overwriting the existing file.
     */
    ensureFilepathUniqueness(filePath: string): string;

    /**
     * Returns JSON containing significant elements of the path.
     */
    parseFilePath(filePath: string): string;

    /**
     * Returns the result of joining two path strings using the platform-dependent path separator.
     */
    pathJoin(pathString1: string, pathString2: string): string;

    /**
     * Deprecated: Use dvascripting.FileUtils.revealAndSelectFiles instead.
     */
    revealAndSelectFiles(filePaths: string[]): boolean;

    /**
     * Returns the full path to a selected file
     */
    saveAsDialog(defaultDir: string, defaultFileName: string, extension: string): string;

    /**
     * Returns the full path to a selected file
     */
    saveAsDialogWithFullPath(fullPathWithExtension: string): string;

    /**
     * Returns the full path to a selected folder
     */
    selectFolder(startFolder: string): string;

    /**
     * Set and store the last used export folder path.
     */
    setlastExportFolder(exportFolder: string): boolean;

    /**
     * Returns truncated string if its length exceeds truncationWidth, for endEllipsis and pathEllipsis types truncated part is replaced with an ellipsis, pathEllipsis truncates the middle of the string
     */
    truncateString(filePath: string, truncationWidth: number, truncationType: string): string;
}

/**
 * The ExportMenuManager object provides the main access for export menu (quick export) settings information and control.
 */
declare interface ExportMenuManager {

    /**
     * Returns if the app is running in Export Menu Mode and the Quick Export Settings are visible.
     */
    readonly isExportMenuRunning: boolean;

    /**
     * Returns true if the Match Sequence Preview Settings Feature has been enabled.
     */
    readonly isMatchSequenceFeatureEnabled: boolean;

    /**
     * Get the current Transcoder.
     */
    readonly transcoder: Transcoder;

    /**
     * Trigger an export action from the Quick Export. Will return true, if the host application take care of the action. Otherwise the client is responsible for the action.
     */
    processExportMenuAction(exportMenuAction: number, inSdmContextGuid: string): boolean;
}

/**
 * The ExportModeManager object provides the main access for full export settings information and control.
 */
declare interface ExportModeManager {

    /**
     * Returns a string representing aspect ratio currently selected for source crop.
     */
    readonly cropAspectRatioSelected: string;

    /**
     * Returns a JSON list of strings representing aspect ratio options to select for source crop.
     */
    readonly cropAspectRatiosList: string;

    /**
     * Returns a JSON list of total 4 integer crop boundary values in the order representing left, top, right and bottom.
     */
    readonly cropBoundariesList: string;

    /**
     * Returns a JSON list of total 2 integers representing X and Y of current crop center position.
     */
    readonly cropCenter: string;

    /**
     * Returns a JSON list of destination categories that should be collapsed in the view.
     */
    readonly destinationCategoriesCollapsedList: string;

    /**
     * Returns a JSON list of destination categories to view categories in order.
     */
    readonly destinationCategoriesList: string;

    /**
     * Returns a JSON list of all destinations for an export.
     */
    readonly destinations: string;

    /**
     * Returns if the app is running in Export Mode and the full Export Settings are visible.
     */
    readonly isExportModeRunning: boolean;

    /**
     * Returns the index of the currently selected destination.
     */
    readonly selectedDestinationIndex: number;

    /**
     * Returns a JSON list of all source selected objects, that request an export.
     */
    readonly sourceSelections: string;

    /**
     * Get the current Transcoder.
     */
    readonly transcoder: Transcoder;

    /**
     * Add a new destination of type destID with destName as custom display name.
     */
    addDestination(destID: string, destName: string): boolean;

    /**
     * Apply source crop with the given aspect ratio.
     */
    applyCropAspectRatio(inCropAspectRatioOptionStr: string): boolean;

    /**
     * Apply source crop with the given pixels for the given direction.
     */
    applyCropBoundary(inDirection: number, inPixelsToCrop: number): boolean;

    /**
     * Adjust crop such that crop horizontal center is at the given center position.
     */
    applyCropCenterX(inCenterX: number): boolean;

    /**
     * Adjust crop such that crop vertical center is at the given center position.
     */
    applyCropCenterY(inCenterY: number): boolean;

    /**
     * Delete a destination.
     */
    deleteDestination(destID: string, groupIndex: number): boolean;

    /**
     * Disable crop and reset crop parameters in standard filter.
     */
    disableAndResetCrop(): boolean;

    /**
     * Trigger an export action from the Export Mode. Will return true, if the host application take care of the action. Otherwise the client is responsible for the action.
     */
    processExportModeAction(exportModeAction: number, inSdmContextGuid: string): boolean;

    /**
     * Rename a destination.
     */
    renameDestination(destID: string, groupIndex: number, destDisplayName: string): boolean;

    /**
     * Restore default destinations
     */
    restoreDefaultDestinations(): boolean;

    /**
     * Select a new destination.
     */
    selectDestination(destID: string, groupIndex: number): boolean;

    /**
     * Should export a destination.
     */
    shouldExportDestination(destID: string, groupIndex: number, shouldExport: boolean): boolean;

    /**
     * Toggle the given category as collapsed vs expanded in the local set that tracks collapsed export destination categories.
     */
    toggleDestinationCategory(inDestinationCategory: string): boolean;
}

/**
 * The ExportPreset object provides the main access for export settings information in a export preset.
 */
declare interface ExportPreset {

    /**
     * The display name of the preset.
     */
    readonly displayName: string;

    /**
     * The fullpath to the presetfile.
     */
    readonly filePath: string;

    /**
     * The folder display path of the preset.
     */
    readonly folderDisplayPath: string;

    /**
     * Returns true|false if the preset is an ingest preset.
     */
    readonly isIngestPreset: boolean;

    /**
     * The search match name of the preset.
     */
    readonly matchName: string;

    /**
     * Returns the Menu Preset summary for this preset.
     */
    readonly presetSummaryJSON: string;

    /**
     * The unique ID of the preset.
     */
    readonly uniqueID: string;

    /**
     * User-provided comments for the preset.
     */
    readonly userComments: string;

    /**
     * The comments of the preset as loc string or resolved.
     */
    comments(resolveZString: boolean): string;

    /**
     * The display name loc string of the preset.
     */
    readonly displayNameLocStr: string;
}

/**
 * The ExportPresetManager object provides the main access for export settings information and control.
 */
declare interface ExportPresetManager {

    /**
     * Returns list of all presets that should be displayed in the preset menu list (Format independent).
     */
    readonly favoritePresetList: Array<any>;

    /**
     * Import presets
     */
    readonly importPresets: object;

    /**
     * Returns true if the preset manager has been enabled by a debug console flag
     */
    readonly isPresetManagerEnabled: boolean;

    /**
     * Returns list of recent used presets that should be displayed in the preset menu list (Format independent).
     */
    readonly recentPresetList: Array<any>;

    /**
     * Returns list of all unsupported formats.
     */
    readonly unsupportedFormatList: string[];

    /**
     * Returns list of known unsupported preset names.
     */
    readonly unsupportedPresetNameList: string[];

    /**
     * Returns list of all user presets.
     */
    readonly userPresetList: object;

    /**
     * Deletes custom presets
     */
    deletePresets(presetIDs: string[]): object;

    /**
     * Export presets
     */
    exportPresets(exportPresetsJSON: string): boolean;

    /**
     * Returns the Menu Preset summary for this presetID.
     */
    presetSummaryJSON(presetID: string, filePath: string): string;

    /**
     * Request active preset to be changed.
     */
    requestActivePresetChange(presetToBeSetAsActive: string): boolean;

    /**
     * Save the favorite JSON string to a dva shared preference file.
     */
    saveFavoritePresetsJSON(presetsJSON: string): boolean;
}

/**
 * The ExportSettings object provides the main access for export settings information and control.
 */
declare class ExportSettings {

    /**
     * Export Settings popup separator identifier.
     */
    static readonly CONST_POPUP_SEPARATOR: string;

    /**
     * Get the Export Menu Manager that manages the Quick Export Settings.
     */
    static readonly exportMenuManager: ExportMenuManager;

    /**
     * Get the Export Mode Manager that manages the full Export Settings.
     */
    static readonly exportModeManager: ExportModeManager;

    /**
     * Returns list of all available export formats.
     */
    static readonly formatNameList: string[];

    /**
     * Get the export filesystem to access export related file functionality.
     */
    static readonly fs: ExportFS;

    /**
     * Get the Preset Manager that manages all the presets.
     */
    static readonly presetManager: ExportPresetManager;

    /**
     * Returns list of all presets for one export format.
     */
    static presetFormatList(formatName: string): Array<any>;
}

/**
 * Exporter class
 */
declare interface Exporter {

    readonly classID: number;
    readonly fileExtension: string;
    readonly fileType: number;
    readonly name: string;
    getPresets(): Array<any>;
}

/**
 * Contains several encoding methods. You can listen to different types of the AMEExportEvent: onEncodeComplete, onError, onMediaInfoCreated, onBatchItemStatusChanged, onItemEncodingStarted, onEncodingItemProgressUpdated, onAudioPreEncodeProgress, onPostProcessListInitialized
 */
declare interface ExporterScriptObject {

    /**
     * Returns the encode time in milliseconds.
     */
    readonly elapsedMilliseconds: number;

    /**
     * Returns the current encode item ID as string. ### TODO: Currently we have a fix encodeID for the exporter. This doesn't make sense since wecreate every batch item with the same encodeID. We should change that so that we create in every encoding API a unique encodeID which we set to the encoder.
     */
    readonly encodeID: string;
    /**
     * Encoding completed without an error. ### TODO: (investigate) It'd be interesting to know if we also get the onEncodeComplete eventin case of an error and which influence this would have to the 'encodeSuccess' API since we set 'mEncodeStatus = true;'in 'void ExporterScriptObject::OnExportComplete()'
     */
    readonly encodeSuccess: boolean;

    /**
     * Export the source with the provided list of presets. Returns true in case of success.
     * @param sourcePath Media path (Premiere Pro projects aren't supported).
     * @param outputPath If outputPath is empty, then the output file location will be generated based on the source location.
     * @param presetsPath Multiple preset paths can be provided separated via a | (e.g. 'path1|path2|path3'
     * @param matchSource Optional. Default value is false.
     */
    exportGroup(sourcePath: string, outputPath: string, presetsPath: string, matchSource?: boolean): boolean;

    /**
     * Export the source with the provided preset. Returns an EncoderWrapper object. ### TODO: Argument writeFramesToDisk only works when parallel encoding is disabled.
     * @param sourcePath Media path or Premiere Pro project path (In case of a Premiere Pro project the last sequence will be used).
     * @param outputPath If outputPath is empty, then the output file location will be generated based on the source location.
     * @param matchSource Optional. Default value is false
     * @param writeFramesToDisk Optional. Default value is false. True writes five frames at 0%, 25%, 50%, 75% and 100% of the full duration. Known issue: Currently it only works with parallel encoding disabled.
     */
    exportItem(sourcePath: string, outputPath: string, presetPath: string, matchSource?: boolean, writeFramesToDisk?: boolean): EncoderWrapper;

    /**
     * Export the Premiere Pro sequence with the provided preset. Returns true in case of success. ### TODO: Argument writeFramesToDisk only works when parallel encoding is disabled.leadingFramesToTrim and trailingFramesToTrim don't have an effect in this API, see DVAME-4200035.
     * @param projectPath Premiere Pro project path.
     * @param outputPath If outputPath is empty, then the output file location will be generated based on the source location.
     * @param matchSource Optional. Default value is false.
     * @param writeFramesToDisk Optional. Default value is false. True writes five frames at 0%, 25%, 50%, 75% and 100% of the full duration. Known issue: Currently it only works with parallel encoding disabled.
     * @param leadingFramesToTrim Optional. Default value is 0.
     * @param trailingFramesToTrim Optional. Default value is 0.
     * @param sequenceName Optional. If sequence name is empty then we use the last sequence of the project.
     */
    exportSequence(projectPath: string, outputPath: string, presetPath: string, matchSource?: boolean, writeFramesToDisk?: boolean, leadingFramesToTrim?: number, trailingFramesToTrim?: number, sequenceName?: string): boolean;

    /**
     * Returns a SourceMediaInfo object. ### TODO: Unfortunately this API only works the very first time. All subsequent calls ignorethe sourcePath and return the SourceMediaInfo which has been created during the very first call.
     * @param sourcePath Media path or Premiere Pro project path (In case of a Premiere Pro project the last sequence will be used).
     */
    getSourceMediaInfo(sourcePath: string): SourceMediaInfo;

    /**
     * Remove all batch items from the queue. Returns true in case of success. ### TODO: The method ExporterScriptObject::RemoveAllBatchItems is ugly and should be improved.We should better call Batch::RemoveAllBatchItems() but this method is identical with ExporterScriptObject::RemoveAllBatchItems.So the proper solution would be to clean up Batch::RemoveAllBatchItems() and provide dvacore::Result when sth. failed and call Batch::RemoveAllBatchItems() from ExporterScriptObject::RemoveAllBatchItems.
     */
    removeAllBatchItems(arg1: boolean): boolean;

    /**
     * Smart render the source with the provided preset. Returns true in case of success. ### TODO: Argument writeFramesToDisk only works when parallel encoding is disabled.
     * @param sourcePath Media path or Premiere Pro project path (In case of a Premiere Pro project the last sequence will be used).
     * @param outputPath If outputPath is empty, then the output file location will be generated based on the source location.
     * @param matchSource Optional. Default value is false.
     * @param writeFramesToDisk Optional. Default value is false. True writes five frames at 0%, 25%, 50%, 75% and 100% of the full duration. Known issue: Currently it only works with parallel encoding disabled.
     * @param leadingFramesToTrim Optional. Default value is 0.
     * @param trailingFramesToTrim Optional. Default value is 0.
     */
    trimExportForSR(sourcePath: string, outputPath: string, presetPath: string, matchSource?: boolean, writeFramesToDisk?: boolean, leadingFramesToTrim?: number, trailingFramesToTrim?: number): boolean;
}

/**
 * A filter (audio/video) of a project
 */
declare class FilterModule {

    /**
     * Returns the display name for the filter
     */
    readonly displayName: string;

    /**
     * Returns the internal matchname for the filter
     */
    readonly matchName: string;

    /**
     * Returns the media type guid for the filter object
     */
    readonly mediaType: object;

    /**
     * Cast an object to FilterModule. In case the provided object can be used as FilterModule, a corresponding object is returned. Otherwise, an exception is thrown.
     */
    static castOrThrow(object: object): FilterModule;

    /**
     * Cast an object to FilterModule. In case the provided object can be used as FilterModule, a corresponding object is returned. Otherwise, null is returned.
     * @returns FilterModule | null
     */
    static queryCast(object: object): FilterModule | null;
}

/**
 * FootageInterpretation class
 */
declare interface FootageInterpretation {

    alphaUsage: number;

    fieldType: number;
    ignoreAlpha: boolean;

    invertAlpha: boolean;
    frameRate: number;
    pixelAspectRatio: number;
    removePulldown: boolean;
    vrConformProjectionType: number;
    vrLayoutType: number;
    vrHorizontalView: number;
    vrVerticalView: number;

    readonly ALPHACHANNEL_IGNORE: number;
    readonly ALPHACHANNEL_NONE: number;
    readonly ALPHACHANNEL_PREMULTIPLIED: number;
    readonly ALPHACHANNEL_STRAIGHT: number;
    readonly FIELD_TYPE_DEFAULT: number;
    readonly FIELD_TYPE_LOWERFIRST: number;
    readonly FIELD_TYPE_PROGRESSIVE: number;
    readonly FIELD_TYPE_UPPERFIRST: number;

    /**
     * Override colorspace of media
     */
    colorSpace: ColorSpace;

    /**
     * GUID of LUT applied on media
     */
    inputLUTID: string;

    /**
     * Set Input LUT on this media from the given LUT file
     */
    setInputLUTFromFilePath(uArg1: string): string;
}

/**
 * FrameRate class
 */
declare class FrameRate {

    /**
     * Read|Write property to get|set ticks per frame.
     */
    ticksPerFrame: number;

    /**
     * Get the number of frames per second.
     */
    readonly value: number;

    /**
     * Constructs a FrameRateObject object
     */
    constructor();

    /**
     * Create frame rate object with a value
     */
    static createWithValue(value: number): FrameRate;

    /**
     * Returns true if the given FrameRate is equal to this FrameRate object
     */
    equals(frameRate: FrameRate): boolean;
}

/**
 * This provides the utility to access Gen extend job
 */
declare class GenExtend {

    /**
     * Check for pre validation errors
     */
    static checkPrevalidation(audiotrackitem: object, videotrackitem: object, deltatime: object, isbackwarddirection: boolean): string[];

    /**
     * Creates a GenExtend object
     */
    constructor();

    /**
     * Create Job for Generative Extend
     */
    static createGenExtendJob(sequence: object, trackitem: object, deltatime: object, isbackwarddirection: boolean): Array<any>;

    /**
     * Regenerate extension
     */
    static regenerateExtension(sequence: object, trackitem: object, isbackwarddirection: boolean): Array<any>;

    /**
     * Revert To Original
     */
    static revertToOriginal(sequence: object, trackitem: object): boolean;

    /**
     * Appends the short-side GenExtend sub-actions for resizing the given transition to span [newStart, newEnd] into the caller's compound action without executing it (the backend the effect-controls trim/slide entry point uses). Must be called with the backend upgrade lock already held (e.g. inside executeNonUndoableTransaction/scopeBackendAccess). Returns an opaque params handle to pass to dispatchGenExtendExtensionsAsync after the compound action executes
     */
    static appendGenExtendTransitionDurationChangeMissingFramesAction(sequence: object, transitiontrackitem: object, newstart: object, newend: object, compoundaction: object): object;

    /**
     * Appends the GenExtend missing-frames sub-actions for the transition at the given cut into the caller's compound action without executing it. Must be called with the backend upgrade lock already held (e.g. inside executeNonUndoableTransaction|scopeBackendAccess). Returns an opaque params handle to pass to dispatchGenExtendExtensionsAsync after the compound action executes
     */
    static appendGenExtendTransitionMissingFramesAction(sequence: object, mediatype: object, trackindex: number, editpoint: object, compoundaction: object): object;

    /**
     * Generate the missing frames on both sides of the given transition, same as the Generate Missing Frames command; returns the dispatched jobs (empty when there was nothing to generate)
     */
    static applyGenExtendTransitionMissingFrames(transitiontrackitem: object, sequence: object): any[];

    /**
     * Whether the given committed transition qualifies for GenExtend missing-frames generation
     */
    static canGenExtendTransition(transitiontrackitem: object, sequence: object): boolean;

    /**
     * Whether the given transition is GenExtend-eligible when resized to span [newStart, newEnd] (the same eligibility query the effect-controls trim/slide path uses): true when every short side is fully satisfiable by generated frames
     */
    static canGenExtendTransitionForDurationChange(transitiontrackitem: object, sequence: object, newstart: object, newend: object): boolean;

    /**
     * Dispatches the async generation jobs for the params returned by appendGenExtendTransitionMissingFramesAction, once the compound action has committed. Returns the dispatched jobs (empty when there was nothing to generate)
     */
    static dispatchGenExtendExtensionsAsync(genextendparams: object): any[];
}

/**
 * This provides the utility for Gen Extend Job
 */
declare class GenExtendJob {

    /**
     * Creates a GenExtend Job object
     */
    constructor();

    /**
     * Gets the error message for Generative Extend job failure
     */
    getGenExtendJobErrorMessage(): string;

    /**
     * Gets the progress item for Generative Extend Job
     */
    getGenExtendJobProgress(): object;
}

/**
 * A random GUID
 */
declare class Guid {

    /**
     * constructor for empty guid
     */
    constructor();

    /**
     * Create a unique guid
     */
    static createUnique(): Guid;

    /**
     * Returnes true if the content of this GUID is equal to the given GUID object
     */
    equals(Guid: object): boolean;

    /**
     * Create a guid from a string
     */
    static fromString(stringValue: string): Guid;

    /**
     * Return string representation of the GUID
     */
    toString(): string;
}

/**
 * Event will be triggered when project items have been added successfully to a project.
 */
declare interface ItemsAddedToProjectSuccessEventObject {

    /**
     * Returns a list of the added project items.
     */
    readonly addedItems: Array<any>;

    /**
     * Returns the local project path or team project identifier.
     */
    readonly projectInfo: string;
}

/**
 * Marker class
 */
declare class Marker {

    comments: string;
    end: Time;
    readonly guid: string;
    name: string;
    start: Time;
    bind(eventName: string, function_: any): void
    getWebLinkFrameTarget(): string | undefined;
    getWebLinkURL(): string | undefined;
    setTimeout(eventName: string, function_: any, milliseconds: number): void
    setTypeAsChapter(): boolean;
    setTypeAsComment(): boolean;
    setTypeAsSegmentation(): boolean;
    setTypeAsWebLink(url: string, frameTarget: string): boolean;

    type: string;
    /**
     * Gets the color index number for the marker at the specified index.
     * @param index The index of the marker to get the color for.
     * @return The color index number for the marker at the specified index.
     */
    getColorByIndex(index?: number): number

    setColorByIndex(index: number): boolean;
    unbind(eventName: string): void
}

/**
 * MarkerCollection class
 */
declare interface MarkerCollection {

    /**
     * Returns the number of markers.
     */
    readonly numMarkers: number;
    bind(eventName: string, function_: any): void

    createMarker(time: number): Marker
    createMarker(start: number, name: string, duration: number, comments: string): Marker | undefined
    deleteMarker(marker: Marker): boolean
    getFirstMarker(): Marker | undefined
    getLastMarker(): Marker | undefined
    getNextMarker(marker: Marker): Marker | undefined
    getPrevMarker(marker: Marker): Marker | undefined
    setTimeout(eventName: string, function_: any, milliseconds: number): void
    unbind(eventName: string): void

    /**
     * Returns a marker object.
     */
    readonly [index: number]: Marker;

    /**
     * Returns the number of markers.
     */
    readonly length: number;
}

/**
 * Algebra BLAS data class
 */
declare class Matrix {

    /**
     * Get number of columns in this data object.
     */
    readonly cols: number;

    /**
     * Get number of rows in this data object.
     */
    readonly rows: number;

    /**
     * Get the value at the given row and column index.
     */
    at(rowIdx: number, colIdx: number): number;

    /**
     * Constructs a new BLAS Matrix object.
     */
    constructor(rows: number, cols: number, data: number[]);

    /**
     * Create a [vectors[0].length x vectors.length] matrix that contains the given vectors as columns. The vectors must all have the same length.
     */
    static fromVectors(vectors: Array<any>): object;

    /**
     * Compute the norm of this vector or matrix.
     */
    norm(): number;

    /**
     * Element-wise absolute value; returns a new vector or matrix.
     */
    abs(): object;

    /**
     * Element-wise add another vector or matrix of the same shape; returns a new vector or matrix.
     */
    add(other: object): object;

    /**
     * Get the linear (column-major) index of the maximum element.
     */
    argMax(): number;

    /**
     * Element-wise divide by another vector or matrix of the same shape; returns a new vector or matrix.
     */
    divide(other: object): object;

    /**
     * Get the maximum element value in this vector or matrix.
     */
    max(): number;

    /**
     * Element-wise maximum of each element and the given scalar; returns a new vector or matrix.
     */
    maximum(scalar: number): object;

    /**
     * Element-wise multiply by another vector or matrix of the same shape; returns a new vector or matrix.
     */
    multiply(other: object): object;

    /**
     * Element-wise power; returns a new vector or matrix.
     */
    pow(exponent: number): object;

    /**
     * Multiply each element by the given scalar; returns a new vector or matrix.
     */
    scale(factor: number): object;

    /**
     * Compute the squared L2 norm of this vector or matrix.
     */
    squaredNorm(): number;

    /**
     * Element-wise subtract another vector or matrix of the same shape; returns a new vector or matrix.
     */
    subtract(other: object): object;

    /**
     * Compute the sum of all elements in this vector or matrix.
     */
    sum(): number;
}

/**
 * Scripting interfaces to Media Browser. Can be used to make and/or cancel thumbnail and project item requests.
 */
declare class MediaBrowser {

    /**
     * Cancel all outstanding project item requests. Typical use would be changing directories while metadata is still being retrieved for items in the previous directory.
     */
    static cancelProjectItemRequests(): number;

    /**
     * Cancel all outstanding thumbnail requests. Typical use would be changing directories while thumbnails are still being retrieved for items in the previous directory.
     */
    static cancelThumbnailRequests(): number;
}

/**
 * Stateless scripting object for the Median Filter algorithm
 */
declare class MedianFilter {

    /**
     * Performs median filtering on an input vector. The kernel size must be a positive integer. Border values are padded with zeros. Using a kernel size of 1 will return the input vector unchanged. Values lower than 1 will throw an exception.
     */
    static filter(vector: object, kernelSize: number): any;

    /**
     * Performs component wise median filtering on an input matrix that is interpreted as col major vectors. Border values are padded with zeros. The kernel size must be a positive integer. Using a kernel size of 1 will return the input matrix unchanged. Values lower then 1 will throw an exception.
     */
    static filterND(vector: object, kernelSize: number): any;
}

/**
 * Event will be triggered when media is missing.
 */
declare interface MissingMediaFoundEventObject {

    /**
     * Returns the production identifier.
     */
    readonly productionID: string;
}

/**
 * The OSInfo object provides information about the operating system.
 */
declare interface OSInfo {

    /**
     * Operating system architecture, arm64 or x64.
     */
    readonly architecture: string;

    /**
     * Operating system emulation.
     */
    readonly emulation: boolean;

    /**
     * Operating system name.
     */
    readonly name: string;
}

/**
 * The ObjectReflection object provides information about the behavior of an object.
 */
declare class ObjectReflection {

    /**
     * The object class properties.
     */
    readonly classProperties: Array<any>;

    /**
     * The object class description.
     */
    readonly description: string;

    /**
     * true if the object is an event object.
     */
    readonly eventObject: boolean;

    /**
     * true if the object is an event target object.
     */
    readonly eventTarget: boolean;

    /**
     * The object instance properties.
     */
    readonly instanceProperties: Array<any>;

    /**
     * The object class name.
     */
    readonly name: string;

    /**
     * Construct ObjectReflection object for given object.
     * @param uArg1 object to inspect
     */
    constructor(uArg1: object);

    /**
     * Retrieve object reflections for given namespace settings. Optionally pass in an Object where each property name is a namespace name with the value true or false for visible or excluded.
     */
    static getObjectReflections(namespaces?: object): any[];

    /**
     * Retrieve third party object reflections for given namespace settings. Optionally pass in an Object where each property name is a namespace name with the value true or false for visible or excluded.
     */
    static getThirdPartyObjectReflections(namespaces?: object): any[];
}

/**
 * This provides the utility to run Object Removal pipeline on the given input sequence and track item.
 */
declare class ObjectRemoval {

    /**
     * Object removal using cloud and on-device service.
     */
    static ObjectRemovalScripting(sequence: object, trackItem: object): object;

    /**
     * Constructs an Object Removal Script Object
     */
    constructor();
}

/**
 * The ParameterReflection object provides information about the behavior of parameters of methods or constructors.
 */
declare interface ParameterReflection {

    /**
     * The data type of the parameter.
     */
    readonly dataType: object;

    /**
     * Deprecated: Use the name property instead.
     */
    readonly description: string;

    /**
     * The parameter name.
     */
    readonly name: string;
}

/**
 * Pixel aspect ratio has a numerator and a denominator.
 */
declare class PixelAspectRatio {

    /**
     * Pixel aspect ration denominator.
     */
    denominator: number;

    /**
     * Pixel aspect ratio numerator.
     */
    numerator: number;

    /**
     * Construct a PixelAspectRatio Object with parameters
     */
    constructor(numerator: number, denominator: number);

    /**
     * Returns true if the given PixelAspectRatioObject is equal to this PixelAspectRatioObject
     */
    equals(pixelAspectRatioObject: PixelAspectRatioObject): boolean;
}

/**
 * Results of a pixel-based comparison. Includes number of different pixels, percent variation, and an error message if necessary.
 */
declare class PixelCompareTestResults {

    /**
     * Calculated average variance. Total variance | num diff pixels
     */
    readonly avgVariance: number;

    /**
     * Image data for the diff image generated
     */
    readonly diffData: string;

    /**
     * Minimum variance.
     */
    readonly minVariance: number;

    /**
     * Number of pixels that were different between the 2 images
     */
    readonly numDiffPixels: number;

    /**
     * Calculated peak signal-to-noise ratio.
     */
    readonly psnr: number;

    /**
     * Error message, if any, for pixel comparison process. Or successful result
     */
    readonly result: number;

    /**
     * Calculated variance between images as a percent
     */
    readonly variance: number;

    /**
     * Construct a pixelComparator test result object
     */
    constructor();
}

/**
 * Performs pixel comparison between two video frames.
 */
declare class PixelComparison {

    /**
     * Construct a pixelComparator object
     */
    constructor();

    /**
     * Takes in 2 PNGs or two VFRaw files and an epsilon value and performs pixel-based comparison on the images. For PNGs, the epsilon value should be an integer, for comparing 8-bit or 15/16-bit integer values. For VFRaw files, the epsilon value should be a float for comparing float values in the nominal [0.0 .. 1.0] range.
     */
    static pixelCompare(inImagePath: string, compareImagePath: string, epsilon: number): any;

    /**
     * Takes in 3 PNGs and performs pixel-based comparison on the non-mask region of the images
     */
    static pixelCompareNonMaskRegion(inOriginalImagePath: string, inCompareImagePath: string, inMaskOnlyPath: string): any;
}

/**
 * PluginSupport has various utility helper functions useful for runtime diagnosis of issues reported to the user from the plugin layer.
 */
declare class PluginSupport {

    /**
     * The date and time when the event occurred
     */
    static eventDateTime(uArg1: number): string;

    /**
     * The description of the event - may be empty for some events
     */
    static eventDescription(uArg1: number): string;

    /**
     * The title of the event
     */
    static eventTitle(uArg1: number): string;

    /**
     * The type of event - 1=Informational, 2=Warning, 3=Error
     */
    static eventType(uArg1: number): number;

    /**
     * Total Events available in Events panel
     */
    static eventsCount(): number;
}

/**
 * Provides scripting env access to dvacore::geom::Point.
 */
declare class PointF {

    /**
     * Get|Set the x value of a point
     */
    x: number;

    /**
     * Get|Set the y value of a point
     */
    y: number;

    /**
     * Construct a PointFloat Object.
     */
    constructor(inX: number, inY: number);

    /**
     * Get the distance from one point to another point
     */
    distanceTo(point: PointF): number;
}

/**
 * PrProduction class
 */
declare class PrProduction {

    readonly name: string | undefined;
    readonly path: string;
    readonly projects: ProjectCollection;
    addProject(srcProjectPath: string, destProjectPath: string): boolean;
    close(): boolean;
    getLocked(project: Project): boolean;

    setLocked(project: Project, newLockState: boolean): boolean;

    moveToTrash(projectPath: string, suppressUI: boolean, saveProject: boolean): boolean;
}

/**
 * Preset manager event object
 */
declare class PresetManagerEvent {

    /**
     * The active preset is requested to be changed.
     */
    static readonly EVENT_ACTIVE_PRESET_CHANGE_REQUESTED: string;

    /**
     * The favorite and recent preset lists have been updated.
     */
    static readonly EVENT_FAVORITE_AND_RECENT_PRESETS_UPDATED: string;

    /**
     * The favorite preset list has been updated.
     */
    static readonly EVENT_FAVORITE_PRESETS_UPDATED: string;

    /**
     * Returns the updated favorite preset list
     */
    readonly favoriteList: Array<any>;

    /**
     * Returns the preset ID of the preset that should be set in transcoder as the currently selected active preset
     */
    readonly presetToBeSetAsActive: string;

    /**
     * Returns the updated recent preset list
     */
    readonly recentList: Array<any>;

    static addEventListener(): any;
    static dispatchEvent(): any;
    static removeEventListener(): any;
}

/**
 * ProgressCategory class
 */
declare interface ProgressCategory {

    /**
     * Get the unique category id of the progress category.
     */
    readonly id: string;

    /**
     * Cancel all jobs being reported under this progress category.
     */
    cancelProgress(): boolean;

    /**
     * Create a new progress item with the given title.
     */
    createProgressItem(title: string): object;

    /**
     * Create a new progress item with the given title and reference id.
     */
    createProgressItemWithReferenceId(title: string, referenceId: object): object;

    /**
     * Get the icon of the progress category as base64 encoded svg.
     */
    getIcon(): string;

    /**
     * Get a progress item that represents all the progress in this category encapsulated in a single item.
     */
    getOverallProgressItem(): object;

    /**
     * Retrieve a progress item by it's reference ID. The returned object can be null in case there is no progress item under this reference id.
     */
    getProgressItemFromReferenceID(referenceGuid: object): object;

    /**
     * Get all the progress items in this progress category.
     */
    getProgressItems(): Array<any>;

    /**
     * Get the title of the progress category.
     */
    getTitle(): string;

    /**
     * Counts all progress items registered in this category.
     */
    getTotalJobs(): number;

    /**
     * Get the cumulative progress value of the progress category.
     */
    getValue(): number;

    /**
     * Check if the progress category has any completed progress items.
     */
    hasDoneJobs(): boolean;

    /**
     * Check if the progress category has any pending jobs.
     */
    hasPendingJobs(): boolean;

    /**
     * Check progress category has progress item that has been configured as unknown progress.
     */
    isIndeterminateProgress(): boolean;

    /**
     * Remove the cancelled and failed progress items from the progress category.
     */
    removeCancelledJobs(): boolean;

    /**
     * Remove the completed progress items from the progress category.
     */
    removeDoneJobs(): boolean;

    /**
     * Remove the specified progress item from the progress category.
     */
    removeProgressItem(inProgressItem: object): boolean;

    /**
     * Indicates that this progress category will be shown in the header bar progress panel
     */
    showInHeaderBar(): boolean;

    /**
     * Indicates that this progress category will only show the status column.
     */
    showOnlyStatusColumn(): boolean;

    /**
     * Check if the progress category can be cancelled.
     */
    supportsCancellation(): boolean;
}

/**
 * ProgressCategoryContainer class
 */
declare class ProgressCategoryContainer {

    /**
     * Event object for when a new progress category is added.
     */
    static readonly EVENT_PROGRESS_CATEGORY_ADDED: string;

    /**
     * Event object for when a progress category is removed.
     */
    static readonly EVENT_PROGRESS_CATEGORY_REMOVED: string;

    /**
     * Event object for when a new progress item is added.
     */
    static readonly EVENT_PROGRESS_ITEM_ADDED: string;

    /**
     * Event object for when a progress item is removed from the category.
     */
    static readonly EVENT_PROGRESS_ITEM_REMOVED: string;

    static addEventListener(): any;
    static dispatchEvent(): any;

    /**
     * Get the list of all the Progress categories.
     */
    getAllProgressCategories(): Array<any>;

    /**
     * Get the Progress Category Container object.
     */
    static getContainer(): object;

    /**
     * Gets or create the given progress category
     */
    getOrCreateProgressCategory(inCategoryID: string, inTitle: string): object;

    /**
     * Retrieve a progress item by it's reference ID. The returned object can be null in case there is no progress item under this reference id.
     */
    getProgressItemFromReferenceID(referenceGuid: object): object;

    /**
     * Check if it has any completed jobs
     */
    hasDoneJobs(): boolean;

    /**
     * Pause all progress items.
     */
    pauseAllProgressItems(): boolean;

    /**
     * Remove all the completed jobs
     */
    removeDoneJobs(): boolean;

    static removeEventListener(): any;

    /**
     * Remove the progress category corresponding to the given ID
     */
    removeProgressCategory(inProgressCategory: object): boolean;

    /**
     * Resume all progress items.
     */
    resumeAllProgressItems(): boolean;

    /**
     * Propagates the given event on this object.
     */
    subscribeToEvent(eventKey: string): boolean;
}

/**
 * Collection of Progress Item properties and methods to pause, resume and cancel progress items.
 */
declare class ProgressItem {

    /**
     * Event object for progress item cancelled.
     */
    static readonly EVENT_PROGRESS_ITEM_CANCELLED: string;

    /**
     * Event object for progress item title changed.
     */
    static readonly EVENT_PROGRESS_ITEM_TITLE_CHANGED: string;

    /**
     * Event object for progress item value changed.
     */
    static readonly EVENT_PROGRESS_ITEM_VALUE_CHANGED: string;

    /**
     * Cancelled progress state.
     */
    static readonly PROGRESS_STATE_CANCELLED: number;

    /**
     * Failed progress state.
     */
    static readonly PROGRESS_STATE_FAILED: number;

    /**
     * Normal progress state.
     */
    static readonly PROGRESS_STATE_NORMAL: number;

    /**
     * Paused progress state.
     */
    static readonly PROGRESS_STATE_PAUSED: number;

    /**
     * Resumed progress state.
     */
    static readonly PROGRESS_STATE_RESUMED: number;

    /**
     * Waiting progress state.
     */
    static readonly PROGRESS_STATE_WAITING: number;

    /**
     * Get the creation time of this item in  ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ) that can be converted to a date object.
     */
    readonly creationTime: string;

    /**
     * Get the ID of the Progress Item.
     */
    readonly referenceId: object;

    static addEventListener(): any;

    /**
     * Cancel the job being reported by this progress item
     */
    cancelProgress(): boolean;

    static dispatchEvent(): any;

    /**
     * Get the maximum progress value of the progress item.
     */
    getMaxValue(): number;

    /**
     * Get the progress state of the progress item.
     */
    getProgressState(): number;

    /**
     * Get the status message of the progress item.
     */
    getStatusMessage(): string;

    /**
     * Get the title of the progress item.
     */
    getTitle(): string;

    /**
     * Get the progress value of the progress item.
     */
    getValue(): number;

    /**
     * Check whether the progress item has finished executing.
     */
    isComplete(): boolean;

    /**
     * Check if the progress item has started execution but not yet complete.
     */
    isInProgress(): boolean;

    /**
     * Check if the progress item has been configured as unknown progress.
     */
    isIndeterminateProgress(): boolean;

    /**
     * Check if the progress item is waiting to start or has started but not yet complete.
     */
    isPending(): boolean;

    /**
     * Pause or resume the progress job based on the state provided.
     */
    pauseOrResumeProgress(inProgresState: number): boolean;

    static removeEventListener(): any;

    /**
     * Set the tooltip for the cancel button of the progress item.
     */
    setCancelToolTip(toolTip: string): boolean;

    /**
     * Set the progress state for the progress item.
     */
    setProgressState(state: number): boolean;

    /**
     * Set the progress value and maximum value for the progress item.
     */
    setProgressStatus(value: number, maxValue: number): boolean;

    /**
     * Set the progress value, maximum value, status message and tooltip for the progress item.
     */
    setProgressStatusAndToolTip(value: number, maxValue: number, statusMessage: string, toolTip: string): boolean;

    /**
     * Set the status message for the progress item.
     */
    setStatusMessage(statusMessage: string): boolean;

    /**
     * Set the title for the progress item.
     */
    setTitle(title: string): boolean;

    /**
     * Set the tooltip for the progress item.
     */
    setToolTip(toolTip: string): boolean;

    /**
     * Set the type for the progress item.
     */
    setType(type: Guid): boolean;

    /**
     * Set the progress item to unknown progress state.
     */
    setUnknownProgress(statusMessage: string): boolean;

    /**
     * Propagates the given event on this object.
     */
    subscribeToEvent(eventKey: string): boolean;

    /**
     * Check if the progress item can be cancelled.
     */
    supportsCancellation(): boolean;

    /**
     * Check if the progress item can be paused|resumed.
     */
    supportsPauseAndResume(): boolean;
}

/**
 * Project class
 */
declare class Project {

    /**
     * f
     */
    activeSequence: Sequence;
    /**
     * The ID of the cloud project.
     */
    readonly cloudProjectlocalID: string;
    readonly documentID: string;
    /**
     * Whether the project is a cloud project.
     */
    readonly isCloudProject: boolean;
    readonly name: string;
    /**
     * Warning: in MacOS Ventura, fetching the project path can throw an error during shutdown
     * Bug ID:  DVAPR-4242199
     *
     * Workaround: put any path checks in a try/catch block if checking may coincide with shutdown
     */
    readonly path: string;
    readonly rootItem: ProjectItem;
    readonly sequences: SequenceCollection;
    /**
     * Adds a property to the project metadata schema.
     * @param name A name for the property to be added.
     * @param label A label for the property to be added.
     * @param type The type of the property. Must be one of the following:
     *             `0` (Integer),
     *             `1` (Real),
     *             `2` (String),
     *             `3` (Boolean)
     * @returns `true` if the property was successfully added, `false` if it failed, or `undefined` if the operation is not supported or an error occurred.
     */
    addPropertyToProjectMetadataSchema(name: string, label: string, type: 0 | 1 | 2 | 3): boolean | undefined
    bind(eventName: string, function_: any): void

    closeDocument(saveFirst?: boolean, promptIfDirty?: boolean): boolean;

    createNewSequence(sequenceName: string, placeholderID: string): Sequence | undefined
    deleteAsset(): void

    deleteSequence(sequence: Sequence): boolean

    exportAAF(
        sequence: Sequence,
        filePath: string,
        mixDownVideo: number,
        explodeToMono: number,
        sampleRate: number,
        bitsPerSample: number,
        embedAudio: number,
        audioFileFormat: number,
        trimSources: number,
        handleFrames: number,
    ): number
    exportFinalCutProXML(exportPath: string, suppressUI: boolean): boolean;
    consolidateDuplicates(): boolean;

    exportOMF(
        sequence: Sequence,
        filePath: string,
        OMFTitle: string,
        sampleRate: number,
        bitsPerSample: number,
        audioEncapsulated: number,
        audioFileFormat: number,
        trimAudioFiles: number,
        handleFrames: number,
        includePan: number,
    ): number
    exportTimeline(exportControllerName: string): number
    getInsertionBin(): ProjectItem;
    getProjectPanelMetadata(): string;
    /**
     * Returns the path to the location to which shared files are to be copied.
     */
    getSharedLocation(): string;
    /**
     * Determines whether copying to a shared location is enabled, for this project.
     */
    isSharedLocationCopyEnabled(): boolean;

    /**
     * Creates a media clip containing bars and tone.
     * @returns `true` if successful
     */
    newBarsAndTone(width: number, height: number, timeBase: number, parNum: number, parDen: number, audioRat: number, clipName: string): boolean;
    newSequence(name: string, presetPath: string): Sequence;

    /**
     * Controls the enablement of transcode-upon-ingest behavior, for the given project.
     * @param state The desired state.
     */
    setEnableTranscodeOnIngest(state: boolean): boolean;

    /**
     * Changes the specified scratch disk path to a new path
     * @returns 0 if unsuccessful
     */
    setScratchDiskPath(newPath: string, whichScratchDiskPath: ScratchDiskType): boolean;

    importAEComps(aepPath: string, compsToImport: string[], TargetBin: ProjectItem): boolean;
    importAllAEComps(arg1: string, TargetBin: ProjectItem, projectBin: ProjectItem): boolean;
    /**
     * Imports files into the project.
     * @param arrayOfFilePathsToImport An array of paths to files to import
     * @param suppressUI optional; if true, suppress any warnings, translation reports, or errors.
     * @param importAsNumberedStill optiona; if present, interprets the file paths as a series of numbered stills.
     */
    importFiles(arrayOfFilePathsToImport: string[], suppressUI?: boolean, TargetBin: ProjectItem, importAsNumberedStill?: boolean): boolean;
    /**
     * Imports sequences from a project.
     * @param projectPath Path to project from which to import sequences.
     */
    importSequences(projectPath: string, sequencesToImport: Array<string>): boolean;

    openSequence(sequenceID: string): boolean
    pauseGrowing(pausedOrNot: boolean): boolean;
    placeAsset(arg1: any): boolean
    save(): boolean;
    saveAs(saveAsPath: string): boolean

    setProjectPanelMetadata(newMetadata: string): boolean;

    createNewSequenceFromClips(newSequenceName: string, ProjectClipItems: Array<ProjectItem>, TargetBin: ProjectItem): Sequence | undefined;

    getSupportedGraphicsWhiteLuminances(): number[];
    getGraphicsWhiteLuminance(): number;

    /**
     * @param newGWL
     */
    setGraphicsWhiteLuminance(newGWL: number): boolean
    setTimeout(eventName: string, function_: any, milliseconds: number): void
    unbind(eventName: string): void
    applyLumetriPreset(p0: string): boolean;
    applyProjectSnapshot(uArg1: string, uArg2: boolean, uArg3: boolean): boolean;
    disableCopyToLocationSetting(): boolean;
    enableAdobeLocationCopy(): boolean;
    enableSharedLocationCopy(p0: string): boolean;
    getAllLumetriPresetsList(): string[];
    getLUTInterpolationMethod(): number;
    getLumetriPresetsForFolderList(p0: string): string[];
    getSupportedLUTInterpolationMethods(): number[];
    isAdobeLocationCopyEnabled(): boolean;
    saveProjectSnapshot(uArg1: string): boolean;
    setLUTInterpolationMethod(uArg1: number): boolean;
    setLogColorManagement(uArg1: boolean): boolean;
    writeSidecarFile(fileName: string, fileExtension: string, contents: string): string;
    getLumetriScopes(): any;
}

/**
 * Event will be triggered when a project has changed.
 */
declare interface ProjectChangedEventObject {

    /**
     * Returns the unique id of the root project item.
     */
    readonly projectID: string;
}

/**
 * ProjectCollection class
 */
declare interface ProjectCollection {

    /**
     * Returns the number of projects.
     */
    readonly numProjects: number;

    bind(eventName: string, function_: any): void

    setTimeout(eventName: string, function_: any, milliseconds: number): void

    unbind(eventName: string): void

    /**
     * Returns a project object.
     */
    readonly [index: number]: Project;

    /**
     * Returns the number of projects.
     */
    readonly length: number;
}

/**
 * Event will be triggered after drag&drop items in the project panel.
 */
declare interface ProjectEndDropEventObject {
}

/**
 * ProjectItem class
 */
declare class ProjectItem {

    readonly children: ProjectItemCollection | undefined
    name: string;
    readonly nodeId: string;
    readonly teamProjectsAssetId: string | undefined;
    readonly treePath: string;

    /**
     * @See {@link VideoTimeDisplay} and {@link AudioTimeDisplay}
     */
    timeDisplayFormat: TIME_FORMAT

    videoComponents(): ComponentCollection | undefined;

    readonly type: number;

    /**
     * Attaches a media file to this clip as its proxy, or as its full-resolution media.
     * @param mediaPath Path to the media file to attach.
     * @param isHiRes `false` attaches the file as the clip's proxy. This can be undone, and shows as "Attach Proxies" in the undo history.
     * `true` relinks the clip's full-resolution media to the file, then re-attaches the clip's existing proxy and restores its interpret-footage settings. This cannot be undone.
     * It fails if the file's audio channel count differs from the clip's current media.
     * @param makeAlternateLink Optional, defaults to `true`. Only has an effect in Team Projects; it's ignored in local projects.
     * `true` keeps the existing link in the Team Project's media locator and adds this file as an alternate link.
     * `false` overwrites the existing link with this file.
     * For proxies, it also only has an effect while the `MZ.AttachProxySupportForTeamProjects` feature is enabled.
     * @returns `true` if the attach action ran. `false` if this item isn't a clip, has no video, or nothing could be attached.
     */
    attachProxy(mediaPath: string, isHiRes: boolean, makeAlternateLink?: boolean): boolean;

    detachProxy(): boolean;
    bind(eventName: string, function_: any): void
    canChangeMediaPath(): boolean;
    canProxy(): boolean;
    changeMediaPath(mediaPath: string, suppressWarnings: boolean): boolean

    createBin(name: string): ProjectItem | undefined
    createSmartBin(name: string, query: string): object | undefined;
    /**
     * 	Returns whether the projectItem represents a sequence.
     *         @returns true, if projectItem is a sequence.
     */
    isSequence(): boolean;

    createSubClip(name: string, startTime: Time, endTime: Time, hasHardBoundaries: boolean, takeVideo?: boolean, takeAudio?: boolean): ProjectItem | undefined;
    deleteBin(): boolean;

    findItemsMatchingMediaPath(matchString: string, ignoreSubclips?: boolean): Array<any>;
    readonly getAudioChannelMapping: AudioChannelMapping;

    /**
     * Get the override color space list
     */
    readonly getOverrideColorSpaceList: Array<ColorSpace>;
    isOffline(): boolean;
    setOffline(): boolean;
    getFootageInterpretation(): FootageInterpretation;
    setFootageInterpretation(InterpretFootage: FootageInterpretation): boolean;
    getOriginalColorSpace(): ColorSpace;

    getProjectColumnsMetadata(): string;

    /**
     * Get GUID of LUT embedded in media
     */
    getEmbeddedLUTID(): string;

    /**
     * Get Guid of Input LUT overridden on media
     */
    getInputLUTID(): string;
    getColorLabel(): number;

    getMarkers(): MarkerCollection | undefined
    getMediaPath(): string;
    getProjectMetadata(): string;
    getProxyPath(): string;
    getXMPMetadata(): string;
    hasProxy(): boolean;

    moveBin(destination: ProjectItem): boolean;
    refreshMedia(): true; // Always returns true
    renameBin(name: string): boolean | undefined;
    select(): boolean;
    setColorLabel(newColor: number): boolean;

    setOverridePixelAspectRatio(numerator: number, denominator: number): boolean

    setOverrideFrameRate(newFrameRate: number): boolean

    setProjectMetadata(buffer: string, keysToBeUpdated: string[]): boolean;
    setScaleToFrameSize(): boolean;
    setStartTime(arg1: object): boolean;

    /**
     * Sets the in point of the clip.
     * @param seconds Time of in point.
     */
    setInPoint(seconds: Time | number | string, p2: number): boolean;

    /**
     * Sets the out point of the clip.
     * @param seconds Time of out point.
     */
    setOutPoint(seconds: Time | number | string, p2: number): boolean;
    /**
     * Clears the in point of the clip.
     */
    clearInPoint(uArg1?: number): boolean;
    /**
     * Clears the out point of the clip.
     */
    clearOutPoint(uArg1?: number): boolean;
    setTimeout(eventName: string, function_: any, milliseconds: number): void

    setXMPMetadata(buffer: string): boolean;
    startTime(): Time | undefined

    /**
     * Set the overridden color space for the project item
     */
    setOverrideColorSpace(ColorSpace: String): boolean;
    getColorSpace(): ColorSpace;
    isMultiCamClip(): boolean
    isMergedClip(): boolean;

    getInPoint(uArg1: number): Time;

    /**
     * @param mediaType Optional: 1 for video only, 2 for audio only, none for all media
     */
    getOutPoint(mediaType?: number): Time
    unbind(eventName: string): void

    readonly interpretedTimebase: string;
    readonly sourceTimebase: string;

    /**
     * Get the overridden color space for the project item
     */
    getOverrideColorSpace(): ColorSpace;
    isAdjustmentLayer(): boolean;
    isColorManagedMedia(): boolean;
    isMulticamClip(): boolean;
    isReference(): boolean;

    /**
     * Checks if the overridden color space is valid for the project item
     */
    isValidOverrideColorSpace(ColorSpace: object): boolean;
    saveProjectSnapshot(uArg1: string): boolean;
    setAudioChannelMapping(AudioChannelMapping: object): boolean;
}

/**
 * ProjectItemCollection class
 */
declare interface ProjectItemCollection {

    /**
     * Returns the number of project items.
     */
    readonly numItems: number;

    bind(eventName: string, function_: any): void

    setTimeout(eventName: string, function_: any, milliseconds: number): void

    unbind(eventName: string): void

    /**
     * Returns a project item object.
     */
    readonly [index: number]: ProjectItem;

    /**
     * Returns the number of project items.
     */
    readonly length: number;
}

/**
 * ProjectItemType class
 */
declare class ProjectItemType {

    static readonly BIN: number
    static readonly CLIP: number
    static readonly FILE: number
    static readonly ROOT: number
    bind(eventName: string, function_: any): void
    setTimeout(eventName: string, function_: any, milliseconds: number): void
    unbind(eventName: string): void
}

/**
 * ProjectManager class
 */
declare class ProjectManager {

    /**
     * An array of strings describing errors encountered.
     */
    readonly errors: Array<Error>;
    /**
     * The `ProjectManagerOptions` structure.
     */
    readonly options: ProjectManagerOptions;
    /**
     * Perform the consolidation and transfer.
     * @param project the `Project` to consolidate.
     */
    process(project: Project, Sequence: object): number;
    unbind(eventName: string): void
}

/**
 * Structure containing all available options for the `ProjectManager`.
 */
declare class ProjectManagerOptions {

    /**
     * Transfer mode setting: Copy source media
     */
    readonly CLIP_TRANSFER_COPY: number;
    /**
     * Transfer mode setting: Transcode source media
     */
    readonly CLIP_TRANSFER_TRANSCODE: number;
    /**
     * Transcode mode setting: Transcode source media to a specific preset
     */
    readonly CLIP_TRANSCODE_MATCH_PRESET: number;
    /**
     * Transcode mode setting: Transcode source media to match clips
     */
    readonly CLIP_TRANSCODE_MATCH_CLIPS: number;
    /**
     * Transcode mode setting: Transcode source media to match sequence settings
     */
    readonly CLIP_TRANSCODE_MATCH_SEQUENCE: number;
    /**
     * Which transcode option to use; will be one of these:
     * 	`CLIP_TRANSCODE_MATCH_PRESET`
     *  `CLIP_TRANSCODE_MATCH_CLIPS`
     * 	`CLIP_TRANSCODE_MATCH_SEQUENCE`
     */
    clipTranscoderOption: number;
    /**
     * Which transfer option to use; will be one of these:
     * 	`CLIP_TRANSFER_COPY`
     *  `CLIP_TRANSFER_TRANSCODE`
     */
    clipTransferOption: number;
    /**
     * If `true`, projectItems not used in a sequence are not transferred
     */
    excludeUnused: boolean;
    /**
     * The number of 'handle' frames to provide, before and after the in/out points of clips in the sequence.
     */
    handleFrameCount: number;
    /**
     * If `true`, preview files will also be transferred.
     */
    includePreviews: boolean;
    /**
     * If `true`, conformed audio files will also be transferred.
     */
    includeConformedAudio: boolean;
    /**
     * If `true`, media files will be renamed to match clip names.
     */
    renameMedia: boolean;
    /**
     * The containing directory for the consolidation/transfer.
     */
    destinationPath: string;
    /**
     * If `true`, all sequences in the project will be transferred.
     */
    includeAllSequences: boolean;

    /**
     * An `Array` of all sequences affected by the transfer.
     */
    affectedSequences: Array<Sequence>
    /**
     * Path the the encoder preset (.epr file) to be used.
     */
    encoderPresetFilePath: string;
    /**
     * If `true`, image sequences will be transcoded.
     */
    convertImageSequencesToClips: boolean;
    /**
     * If `true`, synthetic importer clips will be transcoded.
     */
    convertSyntheticsToClips: boolean;
    /**
     * If `true`, After Effects compositions will be transcoded.
     */
    convertAECompsToClips: boolean;
    /**
     * If `true`, source media will be copied not transcoded, if transcoding would have resulted in loss of alpha information.
     */
    copyToPreventAlphaLoss: boolean;

    readonly CLIP_MODE_CONSOLIDATE_AND_TRANSCODE: number;
    readonly CLIP_MODE_RENDER_AND_REPLACE: number;
    clipTranscodeMode: number;
}

/**
 * Event will be triggered when the project clip selection has been changed. The event contains a list of selected project items and the project view id.
 */
declare interface ProjectSourceClipSelectionEventObject {

    readonly projectViewID: string;
    readonly selectedItems: Array<any>;
}

/**
 * Properties class
 */
declare class Properties {

    clearProperty(propertyKey: string): boolean;
    doesPropertyExist(propertyKey: string): boolean;
    getProperty(propertyKey: string): string;
    isPropertyReadOnly(propertyKey: string): boolean;
    setProperty(property: string, value: any, persistent?: number, createIfNotExist?: boolean): boolean;
}

/**
 * The PropertyReflection object provides information about the behavior of an property.
 */
declare interface PropertyReflection {

    /**
     * true if it is an asynchronous property.
     */
    readonly async: boolean;

    /**
     * Output type.
     */
    readonly dataType: object;

    /**
     * The property description.
     */
    readonly description: string;

    /**
     * The property name.
     */
    readonly name: string;

    /**
     * Parameters of method or constructor, undefined for other property types
     */
    readonly parameters: any[] | undefined;

    readonly type: any;
}

/**
 * QEApp class
 */
declare interface QEApplication {

    /**
     * EA object
     */
    readonly ea: QEEA;
    readonly name: string;

    readonly version: string;
    readonly config: string;
    readonly location: string;
    readonly platform: string;

    readonly language: string;

    /**
     *  The QE representation of the Project.
     */
    readonly project: QEProject;

    readonly codeProfiler: CodeProfiler;

    readonly audioChannelMapping: number;

    readonly source: QESource;
    getDebugDatabaseEntry(p0: string): string;
    executeConsoleCommand(p0: string): boolean;

    outputToConsole(text: string, uArg1: boolean): boolean;
    exit(): boolean;
    stop(): boolean;
    open(p0: string, uArg1: boolean): boolean;
    enablePlayStats(): boolean;
    startPlayback(): boolean;
    stopPlayback(): boolean;
    newProject(p0: string): boolean;
    wait(p0: number): boolean;
    localize(p0: string): string;
    enablePerformanceLogging(): boolean;
    disablePerformanceLogging(): boolean;
    isPerformanceLoggingEnabled(): boolean;
    getSequencePresets(): string[];
    setAudioChannelMapping(p0: number): boolean;
    beginDroppedFrameLogging(p0: string): boolean;
    log(): any
    getModalWindowID(): string;
    setDebugDatabaseEntry(p0: string, p1: string): boolean;

    /**
     * Cloud Dispatcher object
     */
    readonly tqm: object;
    endDroppedFrameLogging(): boolean;
    getDroppedFrames(): string;
    getProgressContainerJSON(): string;
    isFeatureEnabled(p0: string): boolean;
    resetProject(): boolean;
    write(p0: string, uArg1: boolean): boolean;
}

/**
 * AudioEffect class
 */
declare interface QEAudioEffect {

    readonly channelType: number;
    readonly name: string;
}

/**
 * AudioTransition class
 */
declare interface QEAudioTransition {

    readonly name: string;
}

/**
 * AuthToken class
 */
declare interface QEAuthToken {

    readonly token: string;
    readonly type: string;
}

/**
 * CloudDispatcher class
 */
declare interface QECloudDispatcher {

    createQueue(queueName: string, queueOwnerName: string): object;
    getActiveRegion(): string;
    getAuthToken(): object;
    getQueueListObject(): object;
    getSupportedRegionList(): string[];
    logIntoTaskQueueManager(): boolean;
    loginByRegion(region: string): boolean;
    setDiscoveryURL(discoveryURL: string): boolean;
}

/**
 * CloudQueue class
 */
declare interface QECloudQueue {

    readonly identifier: string;
    readonly name: string;

    /**
     * @param uArg1 Job name
     * @param uArg2 Binary project snapshot path
     * @param uArg3 Binary export preset path
     * @param uArg4 Output file path
     */
    createRemoteAMERenderJob(uArg1: string, uArg2: string, uArg3: string, uArg4: string): object;

    /**
     * @param uArg1 Job name
     * @param uArg2 Project path
     * @param uArg3 Item GUID
     * @param uArg4 Binary export preset path
     * @param uArg5 Output file path
     */
    createRemoteAMERenderProjectJob(uArg1: string, uArg2: string, uArg3: string, uArg4: string, uArg5: string): object;

    loadAsync(): boolean;
    loadSync(): string;

    /**
     * @param uArg1 Job name
     * @param uArg2 Binary project snapshot path
     * @param uArg3 Binary export preset path
     * @param uArg4 Output file path
     */
    prepareRemoteAMERenderJob(uArg1: string, uArg2: string, uArg3: string, uArg4: string): object;

    /**
     * @param uArg1 Job name
     * @param uArg2 Project path
     * @param uArg3 Item GUID
     * @param uArg4 Binary export preset path
     * @param uArg5 Output file path
     */
    prepareRemoteAMERenderProjectJob(uArg1: string, uArg2: string, uArg3: string, uArg4: string, uArg5: string): object;
}

/**
 * CloudQueueList class
 */
declare interface QECloudQueueList {

    getQueueByID(uArg1: string): object;
    getQueues(): Array<any>;
    loadAsync(): boolean;
    loadSync(): boolean;
}

/**
 * Component class
 */
declare interface QEComponent {

    readonly id: number;
    readonly matchName: string;
    readonly name: string;
    getParamControlValue(p0: string, uArg1: string): string;
    getParamKeyframes(p0: string): string[];
    getParamList(): string[]
    getParamValue(p0: string, uArg1: string): string;
    remove(): boolean;
    setParamValue(p0: string, p1: string, p2: string): boolean;
}

/**
 * Conflict class
 */
declare interface QEConflict {

    readonly availableResolveTypes: Array<any>;
    readonly id: string;
    readonly name: string;
    readonly type: string;
}

/**
 * CreativeCloudIdentity class
 */
declare interface QECreativeCloudIdentity {

    readonly accessToken: string;
    readonly deviceIdentifier: string;
    readonly email: string;
    readonly personGUID: string;
}

/**
 * EA class
 */
declare interface QEEA {

    getSessionSyncStatus(): string;
    getRemoteServerBuildVersion(): string;
    isSyncCommandEnabled(): boolean;
    isShareCommandEnabled(): boolean;
    isLoggedIn(): boolean;
    convertProjectIntoProduction(p0: string, p1: string, p2: boolean, p3: string, p4: boolean): boolean;
    convertProductionIntoProject(p0: string): boolean;
    isConvertProjectIntoProductionRunning(): boolean;
    getProcessID(): string;
    getUsername(): string;
    getAuthToken(): any
    setAuthToken(p0: string, p1: string, p2: string): number;

    getProductionList(): Array<any>;
    getArchivedProductionList(): Array<any>;
    getInviteList(): Array<any>;

    openProduction(p0: string, uArg1: boolean): boolean;
    sync(): boolean;
    canShare(): number;
    share(p0: string): boolean;
    getConflicts(): Array<any>;
    resolveConflict(p0: object, p1: object): boolean;
    doesEditingSessionHaveLocalMedia(): boolean;
    benchmarkReflectEverything(): number;
    waitForCurrentReflectionToComplete(): boolean;
    isCollaborationOnly(): boolean;
    isHostedCollaborationOnly(): boolean;
    getLoggedInDataServerVersion(): any
    getDiscoveryURL(): string;
    getURL(): any
    postURL(): any
    createProduction(p0: string, p1: string, p2: boolean, p3: string, p4: string, p5: boolean): object;
    setLocalHubConnectionStatus(p0: number): boolean;
    getLoggedInUserDisplayId(): any
    renameProduction(p0: string): boolean;

    readonly isAdministrator: boolean;
    closeProduction(p0: string): boolean;
    doesProjectHaveUnsharedChanges(): boolean;
    fetchIMSAccessToken(clientID: string, clientSecret: string, scope: string): string;
    getAdminInterface(): object;
    getCreativeCloudIdentity(): object;

    /**
     * @param uArg1 production identifier
     */
    getProductionByID(uArg1: string): object;
    getUserEmail(): string;
    isConvertProductionIntoProjectRunning(): boolean;

    /**
     * @param uArg1 production identifier
     */
    openCleanSandbox(uArg1: string): boolean;
    saveProductionAs(p0: string, p1: string): boolean;
    setMediaCachePath(p0: string): boolean;
}

/**
 * HTTPResponse class
 */
declare interface QEHTTPResponse {

    getBody(): string;
    getError(): string;
    getHeaderKeys(): string[];
    getHeaderValue(p0: string): string;
    getStatusCode(): number;
}

/**
 * MappedUnmappedMediaObject class
 */
declare interface QEMappedUnmappedMediaObject {

    readonly filePath: string;
    readonly isMapped: boolean;
    readonly volumeRelativePath: string;
    addNewMediaMapping(p0: string): boolean;
    copyToSharedStorage(p0: string): boolean;
    deleteMediaMapping(): boolean;
    shareMediaMapping(): boolean;
}

/**
 * MasterClip class
 */
declare interface QEMasterClip {

    readonly audioChannelType: number;
    readonly audioFrameRate: number;
    readonly audioNumChannels: number;
    readonly audioSampleSize: number;
    readonly duration: string;
    readonly filePath: string;
    readonly name: string;
    readonly videoFieldType: number;
    readonly videoFrameHeight: number;
    readonly videoFrameRate: number;
    readonly videoFrameWidth: number;
    readonly videoHasAlpha: boolean;
    readonly videoPixelAspectRatio: string;
    clearChildClips(): boolean;
    clearInPoint(): boolean;
    clearOutPoint(): boolean;
    containsCaptioningStream(pp0: string, pp1: string): boolean
    containsCaptions(): boolean
    getCaptioningStreamAt(pp0: number): object
    hasChildClipsInUse(): boolean;
    numCaptioningStreams(): number
    numOfChildClips(): number;
    numOfChildClipsInUse(): number;
    setAudioInPoint(pp0: string): boolean
    setAudioOutPoint(pp0: string): boolean
    setDuration(pp0: string): boolean
    setInPoint(pp0: string): boolean
    setOutPoint(pp0: string): boolean
    setVideoInPoint(pp0: string): boolean
    setVideoOutPoint(pp0: string): boolean
}

/**
 * MediaLocatorObject class provides access to a medialocator.
 */
declare interface QEMediaLocatorObject {

    readonly identifier: string;

    /**
     * Return JSON data blob describing the media locator properties object.
     */
    getMediaLocatorPropertiesAsJSON(): string;

    /**
     * Set JSON data blob describing the media locator properties object.
     */
    setMediaLocatorProperties(uArg1: string): boolean;
}

/**
 * Multicam class
 */
declare interface QEMulticam {

    changeCamera(p0: number): boolean;
    enable(): boolean;
    play(): boolean;
    record(): boolean;
    stop(): boolean;
}

/**
 * Player class
 */
declare interface QEPlayer {

    readonly loopPlayback: false;
    readonly droppedFrames: string;
    readonly totalFrames: string;
    readonly audioDropouts: number;
    readonly audioMediaNotFound: number;

    readonly audioClockJitters: number;
    readonly audioIOOverloads: number;
    readonly audioIODropouts: number;
    readonly audioPrefetchBehinds: number;
    readonly audioDeviceLoadAvg: number;
    readonly audioDeviceLoadMin: number;
    readonly audioDeviceLoadMax: number;
    readonly audioDeviceLoadStdDev: number;
    play(playbackSpeed: number): boolean;
    stop(): boolean;
    step(deltaTimecode: string): boolean;
    startScrubbing(): boolean;
    setLoopPlayback(loopingEnabled: boolean): boolean;
    enableStatistics(uArg1: boolean): boolean;
    disableStatistics(uArg1: boolean): boolean;
    clearAudioDropoutStatus(): boolean;
    captureAudioDeviceLoad(): boolean;
    getPosition(): string;
    readonly avgFPS: string;
    readonly avgPrefetchTime: string;
    readonly avgRenderRate: string;
    readonly isPlaying: boolean;
    readonly preroll: string;
    endScrubbing(): boolean;
    scrubTo(p0: string): boolean;
}

/**
 * ProductionBatons class
 */
declare interface QEProductionBatons {

    acquireBaton(p0: object): boolean;
    batonIsHeldForSequence(p0: object): boolean;
    batonIsHeldForSequenceByCurrentUser(p0: object): boolean;
    releaseBaton(p0: object): boolean;
}

/**
 * ProductionHistory class
 */
declare interface QEProductionHistory {

    readonly length: number;
    getNextVersions(): object;
    getVersionAt(uArg1: number): object;
}

/**
 * ProductionMediaMappingObject class
 */
declare interface QEProductionMediaMappingObject {

    readonly containsMappedFiles: boolean;
    readonly containsUnmappedFiles: boolean;
    readonly getAllMappedFiles: Array<any>;
    readonly getAllUnmappedFiles: Array<any>;
}

/**
 * ProductionVersion class
 */
declare interface QEProductionVersion {

    readonly productionURL: string;
    readonly revision: string;
    readonly timestamp: string;
    readonly title: string;
    readonly userID: string;
    readonly username: string;
    getProduction(): object;
}

/**
 * ProfileDataLog class
 */
declare interface QEProfileDataLog {

    readonly averageTime: number;
    readonly id: string;
    readonly longestTime: number;
    readonly numLogs: number;
    readonly shortestTime: number;
    readonly totalTime: number;
    clear(): boolean;
}

/**
 * Project class
 */
declare interface QEProject {

    readonly currentRendererName: string;
    readonly importFailures: string[];
    readonly isAudioConforming: boolean;
    readonly isAudioPeakGenerating: boolean;
    readonly isIndexing: boolean;
    readonly name: string;
    readonly numActiveProgressItems: number;
    readonly numAudioPeakGeneratedFiles: number;
    readonly numBins: number;
    readonly numConformedFiles: number;
    readonly numIndexedFiles: number;
    readonly numItems: number;
    readonly numSequenceItems: number;
    readonly numSequences: number;
    readonly path: string;

    /**
     * Create new Black Video
     *
     * @param width width in pixels
     * @param height height in pixels
     * @param framerate framerate
     * @param aspectNumerator pixel aspect numerator
     * @param aspectDenominator pixel aspect denominator
     *
     * @example qe.project.newBlackVideo(1920, 1080, 24, 1, 1)
     */
    newBlackVideo(
        width: number,
        height: number,
        framerate: number,
        aspectNumerator: number,
        aspectDenominator: number,
    ): boolean

    /**
     *  Get the QE representation of the currently active Sequence.
     *
     * @example qe.project.getActiveSequence();
     */
    getActiveSequence(): QESequence

    /**
     * @param name The name of the new Sequence.
     * @param pathToPreset The path the the sequence preset to use.
     *
     * @example qe.project.newSequence('Rough Cut', 'path/to/preset.sqpreset');
     *
     * See: https://github.com/Adobe-CEP/Samples/blob/00366bf8a86e44bd83704a04a8f4f0cdc75fd38f/PProPanel/jsx/PPRO/Premiere.jsx#L425
     */
    newSequence(name: string, pathToPreset: string): boolean

    /**
     * Delete cached preview files for the specified media type.
     * 
     */
    deletePreviewFiles(type: MediaType): boolean
    /**
     * Deletes all of this project's preview (render) files of one media type, then recalculates every sequence's video render bar. Can't be undone.
     * @param {string | "228CDA18-3625-4d2d-951E-348879E4ED93" | "80B8E3D5-6DCA-4195-AEFB-CB5F407AB009" | "FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF"} mediaType Media type GUID string:
     * "228CDA18-3625-4d2d-951E-348879E4ED93" = video previews,
     * "80B8E3D5-6DCA-4195-AEFB-CB5F407AB009" = audio previews,
     * "FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF" = both.
     *  Any other GUID deletes nothing.
     * @example qe.project.deletePreviewFiles("FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF"); // any
     * @returns false if there's no project or the video delete fails; otherwise true.
     */
    deletePreviewFiles(mediaType): boolean;

    findItemByID(pp0: string): object
    flushCache(): boolean;

    getAudioEffectByName(pp0: string, channelType: number, pp2?: boolean): object;
    /** @param effectType defaults to 1 here, not 0. */
    getAudioEffectList(effectType?: number, useMatchNames?: boolean): string[];
    getAudioTransitionByName(pp0: string, pp1?: boolean): object
    getAudioTransitionList(pp0?: boolean): string[]
    getBinAt(pp0: number): QEProjectItemContainer
    getItemAt(pp0: number): object
    getRemainingMetadataCacheIndexCount(): number;
    getRendererNames(): string[]
    getSequenceAt(pp0: number): QESequence
    getSequenceItemAt(pp0: number): QESequenceItem

    /**
       * Finds a video effect by exact, case-sensitive name.
     * @param name Effect name.
     * @param useMatchName Default false = compare display names; true = compare internal match names.
     * @returns A QEVideoEffect. If nothing matched it's an empty one whose name is "", not null.
     */
    getVideoEffectByName(name: string, useMatchName?: boolean): QEVideoEffect;

    /**
     * @param {0|1|2|3} effectType 0 = all (default), 1 = Accelerated, 2 = 32-bit, 3 = YUV. Above 3 throws.
     * @param useMatchNames false = display names (default), true = internal match names.
     */
    getVideoEffectList(effectType?: number, useMatchNames?: boolean): string[];

    /**
     * Finds a video transition by exact, case-sensitive name.
     * @param name Transition name.
     * @param useMatchName Default false = compare display names; true = compare match names.
     * @returns A QEVideoTransition. If nothing matched it's an empty one whose name is "", not null.
     */
    getVideoTransitionByName(name: string, useMatchName?: boolean): QEVideoTransition;

    /**
     * @param {0|1|2|3} effectType Same filter as getVideoEffectList: 0 = all (default), 1 = Accelerated, 2 = 32-bit, 3 = YUV. Above 3 throws.
     * @param useMatchNames false = display names (default), true = internal match names.
     */
    getVideoTransitionList(effectType?: number, useMatchNames?: boolean): string[];

    /**
     * Imports multiple After Effects compositions.The first argument is the path of the After Effects project            and the second argument is a vector of composition names contained in that project.
     */
    importAEComps(pp0: string, pp1: string[]): boolean;

    /**
     * Imports all After Effects compositions contained in the After Effects Project
     */
    importAllAEComps(pp0: string): boolean

    importFiles(pp0: string[], pp1: boolean, pp2: boolean): boolean;

    newBin(pp0: string): QEProjectItemContainer
    newCaption(
        pstandard: string,
        pstream: string,
        ptimebase1: string,
        pgrid: string,
        ptimebase2: string,
        pparnum: number,
        pparden: number,
        ptestData: boolean,
    ): boolean

    newSmartBin(pp0: string, pp1: string): boolean
    newTransparentVideo(pp0: number, pp1: number, pp2: number, pp3: number, pp4: number): boolean
    newUniversalCountingLeader(
        pp0: number,
        pp1: number,
        pp2: number,
        pp3: number,
        pp4: number,
        pp5: number,
    ): boolean
    redo(): boolean;
    resetNumFilesCounter(): boolean;
    save(): boolean;

    setRenderer(pp0: string): boolean
    sizeOnDisk(): number;
    undo(): boolean;
    undoStackIndex(): number;
    close(p0: boolean, p1: boolean): boolean;
    import(p0: string[], isNumberedStills: boolean): boolean;
    importPSD(p0: string): boolean;
    importProject(filePath: string, sequences: string[]): boolean;
    init(): boolean;
    newBarsAndTone(): boolean;
    newBarsAndTone(p0: number, p1: number, p2: number, p3: number, p4: number, p5: number): boolean;
    newColorMatte(p0: number, p1: number, p2: number, p3: number, p4: number): boolean;
    saveAs(p0: string): boolean;
}

/**
 * ProjectItem class
 */
declare interface QEProjectItem {

    readonly clip: QEMasterClip
    readonly filePath: string;
    readonly mediaSyncStatus: string
    readonly name: string;
    automateToSequence(pp0: object, pp1: number, pp2: number, pp3: number, pp4: number): boolean
    containsSpeechTrack(): boolean;
    createProxy(pp0: string, pp1: string): boolean
    getMetadataSize(): number;
    isAudioConforming(): boolean;
    isAudioPeakGenerating(): boolean;
    isIndexing(): boolean;
    isOffline(): boolean;
    isPending(): boolean;
    linkMedia(pp0: string, pp1: boolean): boolean
    openInSource(): boolean;
    rename(assetName: string): boolean;
    setOffline(): boolean;
}

/**
 * ProjectItemContainer class
 */
declare interface QEProjectItemContainer {

    readonly name: string;
    readonly numBins: number;
    readonly numItems: number;
    readonly numSequenceItems: number;
    readonly numSequences: number;
    flushCache(): boolean;
    getBinAt(pp0: number): QEProjectItemContainer
    getItemAt(pp0: number): QEProjectItem
    getSequenceAt(pp0: number): QESequence
    getSequenceItemAt(pp0: number): object
    newBin(pp0: string): boolean
}

/**
 * RemoteAMERenderJob class
 */
declare interface QERemoteAMERenderJob {

    readonly created: string;
    readonly estimatedCompletion: string;
    readonly identifier: string;
    readonly isCompleted: boolean;
    readonly isError: boolean;
    readonly lastModified: string;
    readonly lockId: string;
    readonly name: string;
    readonly progress: number;
    readonly progressState: string;
    readonly state: string;
    readonly type: string;

    /**
     * @param uArg1 path to input
     */
    addInput(name: string, uArg1: string): boolean;

    cancel(): boolean;
    loadAsync(): boolean;
    loadSync(): string;
    start(): boolean;
}

/**
 * RemoteAssetObject class
 */
declare interface QERemoteAssetObject {

    readonly additionalMediaLocatorIDs: string[];
    readonly name: string;
    readonly primaryMediaLocatorID: string;
    readonly type: string;
    getAdditionalMediaLocators(): Array<any>;
    getPrimaryMediaLocator(): object;
    import(): boolean;
}

/**
 * RemoteProduction class
 */
declare interface QERemoteProduction {

    readonly archiveURL: string;
    readonly deleteArchivedURL: string;
    readonly description: string;
    readonly identifier: string;
    readonly isOwnedByMe: boolean;
    readonly lastModified: string;
    readonly name: string;
    readonly restoreURL: string;
    readonly tags: string;
    readonly type: string;
    readonly url: string;
    archiveProduction(): boolean;
    deleteArchivedProduction(): boolean;
    getBatons(): object;
    getCollaborators(): Array<any>;
    getHistory(): object;

    /**
     * @param uArg1 Media locator id
     */
    getMediaLocator(uArg1: string): object;

    getMediaMappings(): object;
    getRemoteProductionID(): string;
    getSessionAssetList(): Array<any>;
    inviteUser(uArg1: string): boolean;
    restoreProduction(): boolean;
    setTags(uArg1: string): boolean;
    waitUntilAllProjectItemsAreLoaded(): boolean;
}

/**
 * RemoteProductionCollaborator class
 */
declare interface QERemoteProductionCollaborator {

    readonly email: string;
    isPresent(): boolean;
    remove(): boolean;
}

/**
 * RemoteProductionInvite class
 */
declare interface QERemoteProductionInvite {

    readonly productionName: string;
    readonly senderName: string;
    accept(): boolean;
    reject(): boolean;
}

/**
 * ResolveType class
 */
declare interface QEResolveType {

    readonly name: string;
}

/**
 * Sequence class
 */
declare interface QESequence {

    /**
     *  Name of the sequence.
     */
    readonly name: string;

    readonly numVideoTracks: 3;

    readonly numAudioTracks: 4;

    /**
     * The Current Time Indicator for the active sequence.
     *
     * See: https://github.com/Adobe-CEP/Samples/blob/00366bf8a86e44bd83704a04a8f4f0cdc75fd38f/PProPanel/jsx/PPRO/Premiere.jsx#L499
     */
    readonly CTI: QETime;

    readonly inPoint: QETime;

    readonly outPoint: QETime;

    readonly workInPoint: QETime;
    readonly workOutPoint: QETime;
    readonly useMaxBitDepth: boolean;
    readonly useMaxRenderQuality: boolean;
    readonly videoDisplayFormat: 110;

    readonly audioDisplayFormat: 200;
    previewFrameSize: [number, number]

    readonly presetList: string[];
    readonly previewPresetPath: string;
    readonly previewPresetCodec: number;
    readonly editingMode: string;
    videoFrameSize: [number, number]
    readonly audioFrameRate: number;
    readonly videoFrameRate: number;
    readonly par: number;
    readonly fieldType: number;
    readonly guid: string;

    readonly player: QEPlayer;

    readonly multicam: Multicam;

    getVideoTrackAt(idx: number): QETrack

    getAudioTrackAt(idx: number): QETrack
    makeCurrent(): boolean;
    close(): boolean;
    isOpen(): boolean;
    renderPreview(): boolean;
    renderAll(): boolean;
    renderAudio(): boolean;

    /**
     * Adds tracks to the current sequence as specified.
     * @param numVideo The number of Video Tracks to add. [Default: 1]
     * @param videoIndex The index at which added Video Track(s) should be inserted into the Video Tracks list. [Default: 0]
     * @param numAudio The number of Audio Tracks to add. [Default: 1]
     * @param audioChannelType The Audio Channel configuration that added Audio Tracks should support. [Default: 1]
     * @param audioIndex The index at which added Audio Track(s) should be inserted into the Audio Tracks list. [Default: 0]
     * @param numSubAudio The number of SubAudio Tracks (Submix Tracks) to add. [Default: 0]
     * @param subAudioChannelType The Audio Channel configuration that added SubAudio Tracks (Submix tracks) should support. [Default: 1]
     * @param subAudioIndex The index at which added SubAudio Track(s) (Submix Track(s)) should be inserted into the SubAudio Tracks list. [Default: 0?]
     */
    addTracks(
        numVideo?: number,
        videoIndex?: number,
        numAudio?: number,
        audioChannelType?: AudioChannelType,
        audioIndex?: number,
        numSubAudio?: number,
        subAudioChannelType?: AudioChannelType,
        subAudioIndex?: number,
    ): boolean
    removeTracks(uArg1: number, uArg2: number, uArg3: number, uArg4: number, uArg5: number, uArg6: number): boolean;
    removeVideoTrack(p0: number): boolean;
    removeAudioTrack(p0: number): boolean;
    removeEmptyVideoTracks(): boolean;
    removeEmptyAudioTracks(): boolean;
    exportToAME(p0: string, p1: string, uArg1: boolean): boolean;
    exportDirect(p0: string, p1: string, uArg1: boolean): boolean;
    getExportComplete(): boolean;
    createExportJob(): any
    /**
     * Retrieve the file
     */
    getExportFileExtension(p0: string): string;

    razor(timecode: string, p1: boolean, p2: boolean): boolean;
    setCTI(p0: string): boolean;
    setInPoint(p0: string, uArg1: boolean, uArg2: boolean): boolean;
    setOutPoint(p0: string, uArg1: boolean, uArg2: boolean): boolean;
    setInOutPoints(p0: string, p1: string, uArg1: boolean): boolean;
    lift(): any
    extract(uArg1: string, uArg2: string): boolean;
    setWorkInPoint(p0: string, uArg1: boolean): boolean;
    setWorkOutPoint(p0: string, uArg1: boolean): boolean;
    setWorkInOutPoints(p0: string, p1: string, uArg1: boolean): boolean;
    lockTracks(p0: string, uArg1: boolean): boolean;
    syncLockTracks(p0: string, uArg1: boolean): boolean;
    muteTracks(p0: string, uArg1: boolean): boolean;

    /**
     * Deletes this sequence's video preview (render) files between In and Out.
     * Every preview segment overlapping the range (except ones that only touch its edges) has its whole file deleted, then the render bar is recalculated. Audio previews aren't touched. Can't be undone.
     * @param inPoint Start of the range: a timecode string in the sequence's video display format, e.g. "00:00:10:00". Parsed the same way as QETrackItem.move's offset.
     * @param outPoint End of the range, same format.
     * @returns true unless the delete action reports an error.
     */
    deletePreviewFiles(inPoint: string, outPoint: string): boolean;

    getRedBarTimes(): Array<any>;
    getGreenBarTimes(): Array<any>;
    getYellowBarTimes(): Array<any>;
    getEmptyBarTimes(): Array<any>;
    setUseMaxBitDepth(p0: boolean): boolean;
    setUseMaxRenderQuality(p0: boolean): boolean;
    setVideoDisplayFormat(displayFormat: number): boolean
    setAudioDisplayFormat(p0: number): boolean;
    setPreviewFrameSize(p0: number, p1: number): boolean;
    setPreviewPresetPath(p0: string): boolean;
    exportFrameDPX(p0: string, p1: string, fileExtension?: ExportFrameExtension): boolean;

    /**
     * See: https://github.com/Adobe-CEP/Samples/blob/00366bf8a86e44bd83704a04a8f4f0cdc75fd38f/PProPanel/jsx/PPRO/Premiere.jsx#L71
     *
     * WARNING : all exportFrame() functions are NOT synchronous
     *
     * @param timecode The timecode or frame number of the frame to export. Format may require replacing [semi-]colons (";:") with underscores ("_").
     * @param filePath The fsName path (including filename) at which to export the png file. Note: Must use Filesystem separator (e.g. Mac > "/" Windows > "\\")
     *
     * @example
     * // get QE sequence
     * var sequence = qe.project.getActiveSequence();
     * var path = new File('C:/path/to/file/frame.png').fsName;
     * // export by timecode
     * sequence.exportFramePNG('00:00:46:13', path);
     * // or export by frame number
     * sequence.exportFramePNG('1117', path);
     */
    exportFramePNG(timecode: string, filePath: string, fileExtension?: ExportFrameExtension): boolean;
    exportFrameTarga(p0: string, p1: string, fileExtension?: ExportFrameExtension): boolean;
    exportFrameJPEG(p0: string, p1: string, fileExtension?: ExportFrameExtension): boolean;
    exportFrameTIFF(p0: string, p1: string, fileExtension?: ExportFrameExtension): boolean;
    flushCache(): boolean;
    exportFrameBMP(p0: string, p1: string, fileExtension?: ExportFrameExtension): boolean;
    exportFrameGIF(p0: string, p1: string, fileExtension?: ExportFrameExtension): boolean;
    isIncompleteBackgroundVideoEffects(): boolean;
    left(uArg1: string, uArg2: string): boolean;
    setAudioFrameRate(p0: number): boolean;
    setVideoFrameSize(p0: number, p1: number): boolean;
}

/**
 * SourceMonitor class
 */
declare interface QESourceMonitor {

    readonly clip: object;
    readonly player: object;
    openFilePath(p0: string): boolean;
}

/**
 * TeamProjectsAdmin class
 */
declare interface QETeamProjectsAdmin {

    getArchivedProductions(): Array<any>;
    getProductions(): Array<any>;
    loadORGProductions(): boolean;
}

/**
 * Time class
 */
declare class QETime {

    readonly ticks: string;
    readonly secs: number;

    readonly frames: number;
    readonly timecode: string;
    constructor();
}

/**
 * Track class
 */
declare interface QETrack {

    readonly id: number;
    readonly index: number;
    readonly name: string;
    /**
     * Work only for Audio Track!
     */
    readonly numComponents: number;
    /**
     *  Return amount of items on track including Clip, Transition, and Empty
     */
    readonly numItems: number;
    /**
     *  Return amount of transition on track starts from 1
     *  By default, Premiere Pro has 1 transition on each track
     *  But this first transition is not avaiable to get
     */
    readonly numTransitions: number;
    readonly type: string;
    /**
     *  Add audio effect to entire track
     *  Example: track.addAudioEffect(qe.project.getAudioEffectByName("Delay"));
     */
    addAudioEffect(p0: object, uArg1: number, uArg2: boolean): boolean;
    /**
     * Work only for Audio Track!
     */
    getComponentAt(index: number): QEComponent
    getItemAt(index: number): QETrackItem
    getTransitionAt(index: number): QETrackItem
    /**
     * Insert a clip to the track at specific timecode
     * @param clip The clip to insert
     * @param timecode The timecode to insert the clip, format: "00:00:00:00"
     */
    insert(clip: QEProjectItem, timecode: string, uArg2: boolean, uArg3: boolean, uArg4: boolean, uArg5: boolean): boolean;

    /**
     * Insert a clip to the track at specific timecode overwriting the existing clip
     * @param clip The clip to insert
     * @param timecode The timecode to insert the clip, format: "00:00:00:00"
     */
    overwrite(clip: QEProjectItem, timecode: string, uArg2: boolean, uArg3: boolean, uArg4: boolean, uArg5: boolean): boolean;
    isLocked(): boolean;
    isMuted(): boolean;
    isSyncLocked(): boolean;

    /**
     * Add edit at specific timecode
     * @param timecode The timecode to add edit, format: "00:00:00:00"
     */
    razor(timecode: string, uArg1: boolean, uArg2?: boolean): boolean;
    setLock(isLocked: boolean): boolean
    setMute(isMuted: boolean): boolean
    setName(name: string): boolean
    setSyncLock(isSyncLocked: boolean): boolean
}

/**
 * TrackItem class
 */
declare interface QETrackItem {

    readonly alignment: number;
    readonly antiAliasQuality: number;
    readonly borderColor: string;
    readonly borderWidth: number;
    readonly duration: string;
    readonly end: QETime
    readonly frameBlend: boolean;
    readonly mediaType: string;
    readonly multicamEnabled: boolean;
    readonly name: string;
    readonly numComponents: number;
    readonly reverse: boolean;
    readonly reversed: boolean;
    readonly scaleToFrameSize: boolean;
    readonly speed: number;
    readonly start: QETime
    readonly staticClipGain: number;
    readonly switchSources: boolean;
    readonly timeInterpolationType: number;
    readonly type: string;
    addAudioEffect(p0: object): boolean;
    /**
     * Add a transition to a QETrackItem
     */
    addTransition(
        transition: object,
        addToStart: boolean,
        inDurationString?: string,
        inOffsetString?: string,
        inAlignment?: number,
        inSingleSided?: boolean,
        inAlignToVideo?: boolean,
    ): boolean

    /**
     * Adds a video effect to this clip.
     * @param effect A QEVideoEffect from qe.project.getVideoEffectByName(). Other objects throw.
     * @example item.addVideoEffect(qe.project.getVideoEffectByName("Lumetri Color"));
     */
    addVideoEffect(effect: QEVideoEffect): boolean;

    canDoMulticam(): boolean;
    getClipPanComponent(): object;
    getComponentAt(index: number): QEComponent
    getProjectItem(): QEProjectItem

    /**
     * Moves this clip the way dragging it in the timeline does: the clip is removed and re-added, so the track's clip order (and the project file's) stays correct, unlike TrackItem.move().
     * It's undoable. With all flags false it's a "Lift & Overwrite Selection".
     *
     * @param timeOffset How far to move, relative to the current position. A timecode string, read with the sequence's video display format and frame rate.
     *  A leading "-" moves left. Use ":", ";" or "." between parts, e.g. "00:00:01:00".
     *  A bare number is read like digits typed into a timecode field: the last two digits are frames, the two before are seconds, and so on. So "10" is 10 frames, but "110" is 1 second 10 frames.
     *  It's a plain frame count when the sequence displays Frames, or when it starts with a separator (":150" is 150 frames). "0" does nothing unless copy is true.
     * @param copy Leaves the original in place and moves a copy ("Copy & …"). Does nothing if extract is also true.
     * @param extract Ripple-deletes the gap left behind, so later clips shift left ("Extract & …"). Otherwise the gap stays ("Lift & …").
     * @param insert Inserts at the destination and pushes later clips right ("… & Insert"). Otherwise it overwrites whatever is there ("… & Overwrite").
     * @param insertFillsGap Only used with insert. The push amount is measured from the first occupied time under the moved clip instead of the drop point, so empty space there is used up first.
     * @param lockOtherTracks Temporarily locks every unlocked track that holds none of the moved clips, then unlocks them afterwards, so the edit only affects the moved clips' tracks.
     * @param alignToVideo true aligns the edit to video, false (the default) to audio. Same flag as TrackItem.remove's inAlignToVideo.
     * @returns Always true, even if nothing moved.
     */
    move(timeOffset: string, copy?: boolean, extract?: boolean, insert?: boolean, insertFillsGap?: boolean, lockOtherTracks?: boolean, alignToVideo?: boolean): boolean;

    /**
     * Move a clip up or down tracks
     *
     * @param videoTrackIndexMoveCount The number of video tracks to move the clip
     * @param audioTrackIndexMoveCount The number of audio tracks to move the clip
     * @param moveFrames The number of frames to shift the clip forward or backward. [Default: 0]
     * @param copyClip If true, the clip will be copied to the new location. If false, the clip will be moved to the new location. [Default: false]
     *
     * @example item.moveToTrack(1, 0, '', true); // move video up one track
     * @example item.moveToTrack(0, 1, '', true); // move audio down one track
     * @example item.moveToTrack(-1, 0, '', true); // move video down one track
     * @example item.moveToTrack(0, -1, '', true); // move audio up one track
     */
    moveToTrack(
        videoTrackIndexMoveCount: number,
        audioTrackIndexMoveCount: number,
        moveFrames: string,
        copyClip?: boolean, // optional: default `false`
    ): boolean

    remove(uArg1: boolean, uArg2: boolean): boolean;

    /**
     * Removes or resets effects on this clip only (not its linked clips), like Remove Attributes. Undoable.
     * With no arguments it removes every non-intrinsic video effect except Lumetri Color.
     * It can't remove audio effects; on audio clips only resetVolume does anything.
     * Bug: two settings are left uninitialised, so a call may also reset an Essential Graphics group or clear unassigned masks.
     * @param resetMotion 		Optional: Default false. Resets Motion on video clips.
     * @param resetOpacity 		Optional: Default false. Resets Opacity on video clips.
     * @param removeAllEffects 	Optional: Default true.  true removes all non-intrinsic video effects except Lumetri Color. false removes nothing.
     * @param unused 			Optional: Default false. Ignored.
     * @param resetVolume 		Optional: Default false. Resets Volume and Channel Volume on audio clips.
     * @returns Always true.
     */
    removeEffects(resetMotion?: boolean, resetOpacity?: boolean, removeAllEffects?: boolean, unused?: boolean, resetVolume?: boolean): boolean;

    rippleDelete(): boolean;
    roll(p0: string, p1: boolean, p2: boolean): boolean;
    setAntiAliasQuality(p0: number): boolean;
    setBorderColor(p0: number, p1: number, p2: number): boolean;
    setBorderWidth(p0: number): boolean;
    setEndPercent(p0: number): boolean;
    setEndPosition(p0: number, p1: number): boolean;
    setFrameBlend(p0: boolean): boolean;
    setMulticam(p0: boolean): boolean;
    setName(p0: string): boolean;
    setReverse(p0: boolean): boolean;
    setScaleToFrameSize(p0: boolean): boolean;

    /**
     * Add a video effect to a QETrackItem
     *
     * @param duration Timecode string to set the clip's new length, or blank string to preserve duration (if sufficient source footage).
     * @param isReversed set if the clip speed should be reversed or not
     * @param p3 Unknown
     * @param ripple Whether to ripple edit other clips on the track (Only matters if the length of the clip changes)
     * @example clip.setSpeed(1.5, '', true, true, true)
     * @example clip.setSpeed(2.0, "00:00:22:15", false, true, false)
     */
    setSpeed(
        speeedFactor: number,
        duration: string,
        isReversed: boolean,
        p3: boolean,
        ripple: boolean,
    ): boolean

    setStartPercent(p0: number): boolean;
    setStartPosition(p0: number, p1: number): boolean;
    setSwitchSources(p0: boolean): boolean;
    setTimeInterpolationType(p0: number): boolean;
    slide(p0: string, uArg1: boolean): boolean;
    slip(p0: string, uArg1: boolean): boolean;
    readonly endPercent: number;
    readonly startPercent: number;
}

/**
 * VideoEffect class
 */
declare interface QEVideoEffect {

    readonly name: string;
}

/**
 * VideoTransition class
 */
declare interface QEVideoTransition {

    readonly name: string;
}

/**
 * RectFloatObject class provides scripting access to dvacore Rect.
 */
declare class RectF {

    /**
     * Get|Set the bottom point of a rect
     */
    bottom: number;

    /**
     * Get|Set the height of a rect
     */
    height: number;

    /**
     * Get|Set the left point of a rect
     */
    left: number;

    /**
     * Get|Set the right point of a rect
     */
    right: number;

    /**
     * Get|Set the size (width|height as a point) for a rect
     */
    size: any;

    /**
     * Get|Set the top point of a rect
     */
    top: number;

    /**
     * Get|Set the width of a rect
     */
    width: number;

    /**
     * Get the center point of a rect
     */
    center(): any;

    /**
     * Construct a RectFloat Object.
     */
    constructor(inLeft: number, inTop: number, inWidth: number, inHeight: number);

    /**
     * Get distance from rect to another point
     */
    distanceTo(inPoint: object): any;
}

/**
 * RemoteProduction class
 */
declare class RemoteProduction {

    readonly description: string;
    readonly name: string;
    readonly url: string;
    bind(eventName: string, function_: any): void
    setTimeout(eventName: string, function_: any, milliseconds: number): void
    unbind(eventName: string): void
}

/**
 * RemoteProductionCollection class
 */
declare interface RemoteProductionCollection {

    /**
     * Returns a remote production object.
     */
    readonly [index: number]: RemoteProduction;

    readonly numProductions: number;
    bind(eventName: string, function_: any): void
    setTimeout(eventName: string, function_: any, milliseconds: number): void
    unbind(eventName: string): void
}

/**
 * ScratchDiskType class
 */
declare class ScratchDiskType {

    static readonly FirstAudioCaptureFolder: string
    static readonly FirstAudioPreviewFolder: string
    static readonly FirstAutoSaveFolder: string
    static readonly FirstCClibrariesFolder: string
    static readonly FirstCapsuleMediaFolder: string
    static readonly FirstVideoCaptureFolder: string
    static readonly FirstVideoPreviewFolder: string
    bind(eventName: string, function_: any): void
    setTimeout(eventName: string, function_: any, milliseconds: number): void
    unbind(eventName: string): void
}

/**
 * A sequence.
 */
declare class Sequence {

    /**
     * Subtitle (Default)
     */
    static readonly CAPTION_FORMAT_SUBTITLE: number

    /**
     * CEA-608
     */
    static readonly CAPTION_FORMAT_608: number
    /**
     * CEA-708
     */
    static readonly CAPTION_FORMAT_708: number

    /**
     * Teletext
     */
    static readonly CAPTION_FORMAT_TELETEXT: number

    /**
     * EBU Subtitle
     */
    static readonly CAPTION_FORMAT_OPEN_EBU: number

    /**
     * OP-42
     */
    static readonly CAPTION_FORMAT_OP42: number
    /**
     * OP-47
     */
    static readonly CAPTION_FORMAT_OP47: number
    sequenceSettings: SequenceSettings

    /**
     * The audio display format of the sequence. Will be one of the following:
     * @See {@link AudioTimeDisplay}
     */
    audioDisplayFormat: AudioTimeDisplay;
    /**
     * A collection of the sequence's audio tracks.
     */
    readonly audioTracks: TrackCollection;
    /**
     * Timecode (as a string) of the end of the sequence.
     */
    readonly end: string;
    /**
     * Width
     */
    readonly frameSizeHorizontal: number;
    /**
     * Height
     */
    readonly frameSizeVertical: number;
    /**
     * Sequence ID
     */
    readonly id: number;
    /**
     * The sequence's markers.
     */
    readonly markers: MarkerCollection | undefined

    /**
     * The available colorspaces
     */
    readonly workingColorSpaceList: Array<any>

    /**
     * The color space in use by the sequence
     */
    workingColorSpace: string
    /**
     * Name (writable).
     */
    name: string;
    videoDisplayFormat: number;
    /**
     * The `projectItem` corresponding to the sequence.
     */
    readonly projectItem: ProjectItem;
    /**
     * Permanent ID of the sequence, within its project.
     */
    readonly sequenceID: string;
    readonly timebase: string;
    readonly videoTracks: TrackCollection;
    /**
     * The starting timecode of the first frame of the sequence, as a string.
     */
    readonly zeroPoint: string;
    /**
     * Adds a new metadata key to the sequence, and sets its value.
     * @param propertyID Name of new property
     * @param propertyValue Value of new property
     */
    attachCustomProperty(propertyID: string, propertyValue: string): boolean;
    bind(eventName: string, function_: any): void

    /**
     * Clones a sequence.
     * @returns the clone Sequence.
     */
    clone(): Sequence
    /**
     * Closes the sequence.
     */
    close(): boolean;
    /**
     * Creates a caption track in the active sequence using caption data from a project item.
     * @param projectItem A captions source clip (e.g. .srt)
     * @param startAtTime Offset in seconds from start of sequence
     */
    createCaptionTrack(projectItem: ProjectItem, startAtTime: number, captionFormat: number): Sequence
    /**
     * Creates a new sequence from the source sequence's in and out points.
     * @param ignoreMapping If True the current selection, not track targeting, will determine
     * the clips to include in the new sequence.
     *
     * If there is no selection, track targeting determines which clips are included in the new sequence.
     */
    createSubsequence(ignoreMapping: boolean): Sequence | undefined;
    /**
     * Exports a new FCP XML file representing this sequence.
     * @param exportPath The full file path (with file name) to create.
     * @param suppressUI Optional; quiets any warnings or errors encountered during export.
     */
    exportAsFinalCutProXML(exportPath: string, suppressUI?: boolean): boolean;
    /**
     * Premiere Pro exports the sequence immediately.
     * @param outputFilePath The output file path (with name).
     * @param presetPath The .epr file to use.
     * @param workAreaType Optional work area specifier.
     */
    exportAsMediaDirect(
        outputFilePath: string,
        presetPath: string,
        workAreaType?: WorkAreaType,
    ): string
    /**
     * Exports the sequence (and its constituent media) as a new PPro project.
     */
    exportAsProject(exportPath: string): boolean;
    /**
     * Retrieves the file extension associated with a given output preset (.epr file).
     * @param presetFilePath full path to .epr file
     */
    getExportFileExtension(presetFilePath: string): string | undefined;
    /**
     * Retrieves the sequence's in point, as a timecode string.
     */
    getInPoint(): string;
    /**
     * Retrieves the sequence's out point, as a timecode string.
     */
    getOutPoint(): string;
    /**
     * Retrieves the sequence's in point, as a `Time` object.
     */
    getInPointAsTime(): Time;
    /**
     * Retrieves the sequence's out point, as a `Time` object.
     */
    getOutPointAsTime(): Time;
    /**
     * Retrieves the current player position, as a `Time` object.
     */
    getPlayerPosition(): Time;

    /**
     * Sets the in point of the sequence to the specified time.
     * @param time Time of in point. Can be given as a number in seconds, a string representing ticks, or a {@link Time} object.
     */
    setInPoint(time: number | string | Time): boolean;
    /**
     * Sets the out point of the sequence.
     */
    setOutPoint(time: number | string | Time): boolean;
    /**
     * Sets the current player position.
     * @param pos The new position, as a string, representing ticks.
     */
    setPlayerPosition(pos: string): boolean;
    setTimeout(eventName: string, function_: any, milliseconds: number): void

    /**
     * Sets the timecode of the first frame of the sequence.
     * @param newStartTime The new starting time, in `ticks`.
     */
    setZeroPoint(newStartTime: string): boolean;
    /**
     * Links the currently-selected `trackItems` together, if possible.
     * @returns `True` if successful.
     */
    linkSelection(): boolean;
    /**
     * Unlinks the currently-selected `trackItems`, if possible.
     * @returns `True` if successful.
     */
    unlinkSelection(): boolean;

    /**
     * Imports a Motion Graphics Template (.mogrt) into the sequence
     * @param pathToMOGRT Complete path to .mogrt
     * @param timeInTicks Time (in ticks) at which to insert
     * @param videoTrackOffset The offset from first video track to targeted track
     * @param audioTrackOffset The offset from first audio track to targeted track
     * @returns newly-created `trackItem` representing the .mogrt
     */
    importMGT(
        pathToMOGRT: String,
        timeInTicks: String,
        videoTrackOffset: number,
        audioTrackOffset: number,
    ): TrackItem
    /**
     * Imports a Motion Graphics Template (.mogrt) from a Creative Cloud Library.
     * @param libraryName The name of Library (from the current PPro user’s Creative Cloud Libraries).
     * @param mgtName The name of .mogrt within that library.
     * @param time The time at which to insert .mogrt, in ticks.
     * @param vidTrackOffset How many tracks from the zero-th video track, into which to insert .mogrt content.
     * @param audTrackOffset How many tracks from the zero-th audio track, into which to insert .mogrt content.
     * @returns newly-created {@link TrackItem} representing the .mogrt
     */
    importMGTFromLibrary(libraryName: string, mgtName: string, time: string, vidTrackOffset: number, audTrackOffset: number): TrackItem;
    /**
     * Returns `true` if work area is enabled.
     */
    isWorkAreaEnabled(): boolean;

    /**
     * Sets the enabled state of the seqeuence work area.
     * @param enableState The desired state
     */
    setWorkAreaEnabled(enableState: boolean): boolean;
    /**
     * Returns the work area in point, in seconds.
     */
    getWorkAreaInPoint(): string;

    /**
     * Specify the work area in point, in seconds.
     * @param time new in point time. Can be given as a number in seconds, a string representing ticks, or a {@link Time} object.
     */
    setWorkAreaInPoint(time: number | string | Time): boolean;
    /**
     * Returns the work area out point, in seconds.
     */
    getWorkAreaOutPoint(): string;

    /**
     * Specify the work area out point, in seconds.
     */
    setWorkAreaOutPoint(tme: number | string | Time): boolean;
    /**
     * @returns the work area in point, as a `Time` object.
     */
    getWorkAreaInPointAsTime(): Time;
    /**
     * @returns the work area out point, as a `Time` object.
     */
    getWorkAreaOutPointAsTime(): Time;

    /**
     * Inserts a clip (`trackItem`) into the sequence.
     * @param projectItem The project item to insert.
     * @param time Time at which to insert.
     * @param vidTrackOffset The offset from the first video track to targeted track
     * @param audTrackOffset The offset from the first audio track to targeted track
     */
    insertClip(
        projectItem: ProjectItem,
        time: Time,
        vidTrackOffset: number,
        audTrackOffset: number,
    ): TrackItem

    /**
     * Overwrites a clip into the sequence.
     * @param projectItem A project item from which to get media.
     * @param time The time at which to add project item. Can be given as a number in seconds, a string representing ticks, or a {@link Time} object.
     * @param vTrackIndex The (zero-based) track index, into which to insert video.
     * @param aTrackIndex The (zero-based) track index, into which to insert audio.
     */
    overwriteClip(projectItem: ProjectItem, time: string | number | Time, vTrackIndex: number, aTrackIndex: number): boolean;

    /**
     * @returns currently-selected clips, as an `Array` of `trackItems`
     */
    getSelection(): Array<TrackItem>
    /**
     * Returns the current sequence settings.
     * @returns SequenceSettings
     */
    getSettings(): SequenceSettings;

    /**
     * Specifies the sequence settings to use.
     * @param newSettings New settings
     */
    setSettings(newSettings: SequenceSettings): boolean;
    isDoneAnalyzingForVideoEffects(): boolean;

    autoReframeSequence(numerator: number, denominator: number, motionPreset: string, sequenceName: string, nest: boolean): Sequence;

    /**
     * @param action Either 'ApplyCuts' or 'CreateMarkers'
     * @param applyCutsToLinkedAudio Operate on linked audio too?
     * @param sensitivity 'LowSensitivity', 'MediumSensitivity', or 'HighSensitivity'
     */
    performCutDetectionOnSelection(
        action: String,
        applyCutsToLinkedAudio: Boolean,
        sensitivity: String,
    ): void

    unbind(eventName: string): void
    performSceneEditDetectionOnSelection(clipOperation: string): boolean;
    renderVideoFrameAtTime(uArg1: string, Time: object, uArg2: boolean): VideoFrame;
    renderVideoFrameAtTimeWithColorSpace(uArg1: string, Time: object, uArg2: string, uArg3: boolean, uArg4: string, uArg5: boolean, uArg6: boolean, uArg7: number): VideoFrame;
    setEnableProxies(uArg1: boolean): boolean;
    setSelection(selection: Array<any>): boolean;
    getEnableProxies(): number;
}

/**
 * Event will be triggered when a sequence has been activated
 */
declare interface SequenceActivatedEventObject {
}

/**
 * SequenceCollection class
 */
declare interface SequenceCollection {

    /**
     * Returns the number of sequences.
     */
    readonly numSequences: number;

    bind(eventName: string, function_: any): void

    setTimeout(eventName: string, function_: any, milliseconds: number): void

    unbind(eventName: string): void

    /**
     * Returns a sequence object.
     */
    readonly [index: number]: Sequence;

    /**
     * Returns the number of sequences.
     */
    readonly length: number;
}

/**
 * SequenceOverlaySelection class
 */
declare class SequenceOverlaySelection {

    /**
     * Overlay: ALPHA
     */
    static readonly ALPHA: number;
    /**
     * Overlay: BLUE
     */
    static readonly BLUE: number;
    /**
     * Overlay: CYAN
     */
    static readonly CYAN: number;
    /**
     * Overlay: DEFAULT
     */
    static readonly DEFAULT: number;
    /**
     * Overlay: GREEN
     */
    static readonly GREEN: number;
    /**
     * Overlay: MAGENTA
     */
    static readonly MAGENTA: number;
    /**
     * Overlay: NONE
     */
    static readonly NONE: number;
    /**
     * Overlay: RED
     */
    static readonly RED: number;
    /**
     * Overlay: YELLOW
     */
    static readonly YELLOW: number;

    /**
     * Constructs a SequenceOverlaySelection object
     */
    constructor();
}

/**
 * Structure containing sequence settings.
 */
declare class SequenceSettings {

    audioChannelCount: number;
    audioChannelType: number;
    audioDisplayFormat: AudioTimeDisplay
    audioSampleRate: Time

    compositeLinearColor: boolean;
    editingMode: string;

    maximumBitDepth: boolean;
    maximumRenderQuality: boolean;
    previewCode: String
    previewFileFormat: string;
    previewFrameHeight: number;
    previewFrameWidth: number;
    videoDisplayFormat: VideoTimeDisplay
    videoFieldType: number;

    videoFrameRate: Time
    videoFrameHeight: number;
    videoFrameWidth: number;
    videoPixelAspectRatio: string;
    vrHorzCapturedView: number;
    vrLayout: number;
    vrProjection: number;
    vrVertCapturedView: number;

    /**
     * Returns the working color space list
     */
    readonly workingColorSpaceList: any[];

    /**
     * APIs to get and set the working color space
     */
    workingColorSpace: ColorSpace;

    /**
     * APIs to get and set auto gamut compression
     */
    autoInputGamutCompressionEnabled: boolean;

    /**
     * APIs to get and set auto tone mapping
     */
    autoToneMapEnabled: boolean;

    /**
     * APIs to get and set the gamut mapping controls
     */
    gamutMappingControls: GamutMappingControls;
    previewCodec: string;
}

/**
 * Static clustering object for Sequential Clustering algorithm
 */
declare class SequentialClustering {

    /**
     * Compare all vectors in a cluster to the next cluster candidate
     */
    static readonly CLUSTER_COMPARE_MODE_ALL_IN_CLUSTER: number;

    /**
     * Compare the centroid of a cluster to the next cluster candidate
     */
    static readonly CLUSTER_COMPARE_MODE_CENTROID: number;

    /**
     * Compare the last vector of a cluster to the next cluster candidate
     */
    static readonly CLUSTER_COMPARE_MODE_LAST_VECTOR: number;

    /**
     * Performs sequential clustering on data points. The preferences parameter contains: threshold (float), compareMode (int32)
     */
    static cluster(dataPointMatrix: object, preferences: object): Clusters;
}

/**
 * SimplifySequenceParams is the collection of settings used to script SimplifySequence as a user would in the ui.
 */
declare class SimplifySequenceParams {

    /**
     * Constant for label color 0
     */
    static readonly LABEL_COLOR_0: number;

    /**
     * Constant for label color 1
     */
    static readonly LABEL_COLOR_1: number;

    /**
     * Constant for label color 10
     */
    static readonly LABEL_COLOR_10: number;

    /**
     * Constant for label color 11
     */
    static readonly LABEL_COLOR_11: number;

    /**
     * Constant for label color 12
     */
    static readonly LABEL_COLOR_12: number;

    /**
     * Constant for label color 13
     */
    static readonly LABEL_COLOR_13: number;

    /**
     * Constant for label color 14
     */
    static readonly LABEL_COLOR_14: number;

    /**
     * Constant for label color 15
     */
    static readonly LABEL_COLOR_15: number;

    /**
     * Constant for label color 2
     */
    static readonly LABEL_COLOR_2: number;

    /**
     * Constant for label color 3
     */
    static readonly LABEL_COLOR_3: number;

    /**
     * Constant for label color 4
     */
    static readonly LABEL_COLOR_4: number;

    /**
     * Constant for label color 5
     */
    static readonly LABEL_COLOR_5: number;

    /**
     * Constant for label color 6
     */
    static readonly LABEL_COLOR_6: number;

    /**
     * Constant for label color 7
     */
    static readonly LABEL_COLOR_7: number;

    /**
     * Constant for label color 8
     */
    static readonly LABEL_COLOR_8: number;

    /**
     * Constant for label color 9
     */
    static readonly LABEL_COLOR_9: number;

    /**
     * Constant for marker color blue
     */
    static readonly MARKER_COLOR_BLUE: number;

    /**
     * Constant for marker color cyan
     */
    static readonly MARKER_COLOR_CYAN: number;

    /**
     * Constant for marker color green
     */
    static readonly MARKER_COLOR_GREEN: number;

    /**
     * Constant for marker color magenta
     */
    static readonly MARKER_COLOR_MAGENTA: number;

    /**
     * Constant for marker color orange
     */
    static readonly MARKER_COLOR_ORANGE: number;

    /**
     * Constant for marker color red
     */
    static readonly MARKER_COLOR_RED: number;

    /**
     * Constant for marker color white
     */
    static readonly MARKER_COLOR_WHITE: number;

    /**
     * Constant for marker color yellow
     */
    static readonly MARKER_COLOR_YELLOW: number;

    /**
     * Set to apply options to Audio items
     */
    applyToAudio: boolean;

    /**
     * Set to apply options to video items
     */
    applyToVideo: boolean;

    /**
     * Set to close vertical gaps on video tracks
     */
    closeVerticalGaps: boolean;

    /**
     * Set to flatten multicam clips
     */
    flattenMulticam: boolean;

    /**
     * SimplifySequence parameters
     */
    static readonly parameters: object;

    /**
     * Set to remove clips with label color(s) - set to an array of LABEL_COLOR_ constants
     */
    removeClipsWithLabelColors: number[];

    /**
     * Set to remove disabled clips
     */
    removeDiabledClips: boolean;

    /**
     * Set to remove disabled tracks
     */
    removeDiabledTracks: boolean;

    /**
     * Set to remove empty tracks
     */
    removeEmptyTracks: boolean;

    /**
     * Set to remove graphics clips
     */
    removeGraphicClips: boolean;

    /**
     * Set to remove offline clips
     */
    removeOfflineClips: boolean;

    /**
     * Set to remove sequence markers with color(s) - set to an array of MARKER_COLOR_ constants
     */
    removeSequenceMarkerColors: number[];

    /**
     * Set to join through edits
     */
    removeThroughEdits: boolean;

    /**
     * Set to remove transitions
     */
    removeTransitions: boolean;

    /**
     * Create a new SimplifySequenceParameterObject instance.
     */
    constructor();

    /**
     * Apply Simplify Sequence to a copied sequence from the currently active sequence
     */
    simplifySequenceOnActiveSequence(newSimplifiedSequenceName: string): boolean;
}

/**
 * Get the width, height, PAR, duration, etc about the imported source
 */
declare interface SourceMediaInfo {

    /**
     * Returns the audio duration of the source
     */
    readonly audioDuration: string;

    /**
     * Returns embedded description of the source
     */
    readonly description: string;

    /**
     * Returns true if the timecode is a drop frame timecode
     */
    readonly dropFrameTimeCode: boolean;

    /**
     * Returns duration of the source
     */
    readonly duration: string;

    /**
     * Returns duration of the source in ticks (available since 23.3)
     */
    readonly durationInTicks: string;

    /**
     * Returns field type of the source
     */
    readonly fieldType: string;

    /**
     * Returns frame rate of the source
     */
    readonly frameRate: string;

    /**
     * Returns height of the source
     */
    readonly height: string;

    /**
     * Returns the importer used to decode the source
     */
    readonly importer: string;

    /**
     * Returns the number of audio channels of the source
     */
    readonly numChannels: string;

    /**
     * Returns the X PAR of the source
     */
    readonly parX: string;

    /**
     * Returns the Y PAR of the source
     */
    readonly parY: string;

    /**
     * Returns sample rate of the source
     */
    readonly sampleRate: string;

    /**
     * Returns width of the source
     */
    readonly width: string;

    /**
     * Returns xmp xml of the source
     */
    readonly xmp: string;
}

/**
 * SourceMonitor class
 */
declare class SourceMonitor {

    bind(eventName: string, function_: any): void

    closeAllClips(): boolean;
    closeClip(): boolean;

    openFilePath(filePath: string): boolean
    /**
     * @returns 0 if successful
     */
    openProjectItem(itemToOpen: ProjectItem): boolean;
    play(speed?: number): boolean;
    setTimeout(eventName: string, function_: any, milliseconds: number): void
    unbind(eventName: string): void
    getPosition(): Time;
    /**
     * Returns project item if successful, null if not.
     */
    getProjectItem(): ProjectItem | null | undefined;
}

/**
 * Algebra BLAS data class
 */
declare class SparseMatrix {

    /**
     * Get number of columns in this data object.
     */
    readonly cols: number;

    /**
     * Get number of rows in this data object.
     */
    readonly rows: number;

    /**
     * Get the value at the given row and column index.
     */
    at(rowIdx: number, colIdx: number): number;

    /**
     * Constructs a new BLAS Matrix object.
     */
    constructor(rows: number, cols: number, data: number[]);

    /**
     * Create a [vectors[0].length x vectors.length] matrix that contains the given vectors as columns. The vectors must all have the same length.
     */
    static fromVectors(vectors: Array<any>): object;

    /**
     * Compute the norm of this vector or matrix.
     */
    norm(): number;

    /**
     * Element-wise absolute value; returns a new vector or matrix.
     */
    abs(): object;

    /**
     * Element-wise add another vector or matrix of the same shape; returns a new vector or matrix.
     */
    add(other: object): object;

    /**
     * Element-wise multiply by another vector or matrix of the same shape; returns a new vector or matrix.
     */
    multiply(other: object): object;

    /**
     * Multiply each element by the given scalar; returns a new vector or matrix.
     */
    scale(factor: number): object;

    /**
     * Compute the squared L2 norm of this vector or matrix.
     */
    squaredNorm(): number;

    /**
     * Element-wise subtract another vector or matrix of the same shape; returns a new vector or matrix.
     */
    subtract(other: object): object;

    /**
     * Compute the sum of all elements in this vector or matrix.
     */
    sum(): number;
}

/**
 * Algebra BLAS data class
 */
declare class SparseVector {

    /**
     * Get number of columns in this data object.
     */
    readonly cols: number;

    /**
     * Get the length of the vector.
     */
    readonly length: number;

    /**
     * Get number of rows in this data object.
     */
    readonly rows: number;

    /**
     * Get the value at the given row index.
     */
    at(rowIdx: number, ColIdx: number): number;

    /**
     * Constructs a new BLAS Vector object.
     */
    constructor(rows: number, data: number[]);

    /**
     * Compute the dot product of this vector with another.
     */
    dot(other: object): number;

    /**
     * Compute the norm of this vector or matrix.
     */
    norm(): number;

    /**
     * Element-wise absolute value; returns a new vector or matrix.
     */
    abs(): object;

    /**
     * Element-wise add another vector or matrix of the same shape; returns a new vector or matrix.
     */
    add(other: object): object;

    /**
     * Element-wise multiply by another vector or matrix of the same shape; returns a new vector or matrix.
     */
    multiply(other: object): object;

    /**
     * Multiply each element by the given scalar; returns a new vector or matrix.
     */
    scale(factor: number): object;

    /**
     * Compute the squared L2 norm of this vector or matrix.
     */
    squaredNorm(): number;

    /**
     * Element-wise subtract another vector or matrix of the same shape; returns a new vector or matrix.
     */
    subtract(other: object): object;

    /**
     * Compute the sum of all elements in this vector or matrix.
     */
    sum(): number;
}

/**
 * Interface to OS spellcheck operations
 */
declare class Spellcheck {

    /**
     * Add word to the specified language set
     */
    static addWord(text: string, language: string): boolean;

    /**
     * Check spelling for a word. Returns a promise to the results.
     */
    static checkSpelling(text: string, language: string): object;

    /**
     * Return a list of candidate words to replace a given substring
     */
    static getCandidates(text: string, startEnd: object, language: string): string[];

    /**
     * Returns true if spell checking is supported on this OS and configuration.
     */
    static spellcheckSupported(): boolean;
}

/**
 * The stock wrangler object for testing stock audio.
 */
declare class StockWrangler {

    /**
     * number of results from last time initiateSearch was called
     */
    readonly numResults: number;

    /**
     * Current Stock Wrangler.
     */
    static readonly wrangler: object;

    /**
     * start an SFX search using the parameters in the Parameter object
     */
    initiateSFXSearch(params: StockWranglerParameter): boolean;

    /**
     * start a music search using the parameters in the Parameter object
     */
    initiateSearch(params: StockWranglerParameter): boolean;
}

/**
 * Script object for stock wrangler search parameters.
 */
declare class StockWranglerParameter {

    /**
     * Set the max bpm .Next search will only have results below this tempo.
     */
    bpmMax: number;

    /**
     * Set the min bpm. Next search will only have results above this tempo
     */
    bpmMin: number;

    /**
     * Set the categories.Next search will only have results that fall within the supplied categories
     */
    categories: string[];

    /**
     * Set the max duration.Next search will only have results below this duration.
     */
    durationMax: number;

    /**
     * Set the min duration.Next search will only have results above this duration
     */
    durationMin: number;

    /**
     * Set the genres.Next search will only have results that fall within the supplied genres
     */
    genres: string[];

    /**
     * Set boolean to search for assets regardless of BPM.Next search will have results containing assets without BPM if true.
     */
    includeAssetsWithoutBPM: boolean;

    /**
     * Set the moods.Next search will only have results that fall within the supplied moods
     */
    moods: string[];

    /**
     * Stock Wrangler search parameters
     */
    static readonly params: object;
}

/**
 * Provide system compatibility report generation
 */
declare class SystemCompatibilityReport {

    static CreateReport(filePath: string): boolean;
}

/**
 * The SystemInfo object provides information about the system.
 */
declare class SystemInfo {

    /**
     * Available physical memory (MB).
     */
    static readonly availablePhysicalMemory: number;

    /**
     * Decription of hardware device
     */
    static readonly deviceDescription: string;

    /**
     * Operating system related information.
     */
    static readonly os: OSInfo;

    /**
     * Total physical memory (MB).
     */
    static readonly totalPhysicalMemory: number;

    /**
     * List of video devices.
     */
    static readonly videoDevices: string[];
}

/**
 * A workspace tab panel.
 */
declare interface TabPanel {

    /**
     * Get the global bounds of the panel
     */
    getBounds(): RectF;

    /**
     * Get the global bounds of the first child UI node matching the given node ID.
     */
    getChildNodeBoundsByNodeID(nodeID: string): RectF;

    /**
     * Get the global bounds of the panel content area
     */
    getContentBounds(): RectF;

    /**
     * Return this tab panel as a UINode object.
     */
    getAsUINode(): UINode;

    /**
     * Get the first child UI node matching the given node ID.
     */
    getChildNodeByNodeID(nodeID: string): UINode;

    /**
     * Get the top-level window that contains this panel.
     */
    getTopLevelWindow(): TopLevelWindow;
}

/**
 * TickTime class
 */
declare class TickTime {

    /**
     * Invalid Tick Time Constant
     */
    static readonly TIME_INVALID: TickTime;

    /**
     * Max Tick Time Constant
     */
    static readonly TIME_MAX: TickTime;

    /**
     * Min Tick Time Constant
     */
    static readonly TIME_MIN: TickTime;

    /**
     * One Hour Tick Time Constant
     */
    static readonly TIME_ONE_HOUR: TickTime;

    /**
     * One Second Tick Time Constant
     */
    static readonly TIME_ONE_MINUTE: TickTime;

    /**
     * One Second Tick Time Constant
     */
    static readonly TIME_ONE_SECOND: TickTime;

    /**
     * Zero Tick Time Constant
     */
    static readonly TIME_ZERO: TickTime;

    /**
     * Get the TickTime in seconds
     */
    readonly seconds: number;

    /**
     * Get the TickTime in ticks as a string
     */
    readonly ticks: string;

    /**
     * Get the TickTime in ticks as a number
     */
    readonly ticksNumber: number;

    /**
     * Constructs a TickTime object
     */
    constructor();

    /**
     * Add another TickTime to this one and return it. This TickTime is not modified.
     * @param tickTime
     */
    add(tickTime: TickTime): TickTime;

    /**
     * alignToFrame will return a TickTime that is aligned to the nearest frame boundary less than the given time for a given frame rate by rounding any fractional portion.
     * @param FrameRate
     */
    alignToFrame(frameRate: FrameRate): TickTime;

    /**
     * AlignToNearestFrame will return a TickTime that is aligned to the nearest frame boundary greater than or less than the given time for a given frame rate by rounding any fractional portion.
     * @param FrameRate
     */
    alignToNearestFrame(frameRate: FrameRate): TickTime;

    /**
     * Constructs a TickTime object with a frame and a frame rate.
     * @param frameRate
     */
    static createWithFrameAndFrameRate(frameCount: number, frameRate: FrameRate): TickTime;

    /**
     * Constructs a TickTime object with seconds.
     * @param seconds
     */
    static createWithSeconds(seconds: number): TickTime;

    /**
     * Constructs a TickTime object with ticks as a string.
     * @param ticks
     */
    static createWithTicks(ticks: string): TickTime;

    /**
     * Constructs a TickTime object with ticks as a number.
     * @param ticksNumber
     */
    static createWithTicksNumber(ticksNumber: number): TickTime;

    /**
     * Divide this TickTime by a divisor and return it. In case of a division by zero TIME_INVALID is returned. This TickTime is not modified.
     * @param divisor
     */
    divide(divisor: number): TickTime;

    /**
     * Returns true if the given TickTime is equal to the TickTime object
     * @param TickTime
     */
    equals(tickTime: TickTime): boolean;

    /**
     * Multiply this TickTime with a factor and return it. This TickTime is not modified.
     * @param factor
     */
    multiply(factor: number): TickTime;

    /**
     * Subtract another TickTime from this one and return it. This TickTime is not modified.
     * @param tickTime
     */
    subtract(tickTime: TickTime): TickTime;

    /**
     * Convert a TickTime to a string using the current display format
     * @param TimeDisplay
     */
    static timeToTimecode(tickTime: TickTime, frameRate: FrameRate, timeDisplay: TimeDisplay): string;

    /**
     * Convert a timecode string to a TickTime using the current display format
     * @param TimeDisplay
     */
    static timecodeToTime(TimecodeString: string, frameRate: FrameRate, timeDisplay: TimeDisplay): TickTime;

    /**
     * Convert the TickTime to a frame number with respect to the provided frame rate.
     * @param frameRate
     */
    toFrame(frameRate: FrameRate): number;
}

/**
 * Time class
 */
declare class Time {

    seconds: number;
    ticks: string;

    bind(eventName: string, function_: any): void

    getFormatted(FrameRate: Time, TimeDisplay: TIME_FORMAT): string;
    /**
     * Sets the Time object to a time in seconds, resulting from dividing the numerator by the denominator.
     */
    setSecondsAsFraction(numerator: number, denominator: number): boolean;

    setTimeout(eventName: string, function_: any, milliseconds: number): void

    unbind(eventName: string): void

    /**
     * Construct a Time object
     */
    constructor();
}

/**
 * TimeDisplay class
 */
declare class TimeDisplay {

    /**
     * Read|Write property to get|set the time display custom frames per second value
     */
    customFPS: number;

    /**
     * Read|Write property to get|set the time display type numeric code
     */
    type: number;

    /**
     * Constructs a TimeDisplay object
     */
    constructor();

    /**
     * Returns true if the given TimeDisplay is equal to this TimeDisplay object
     */
    equals(timeDisplay: TimeDisplay): boolean;
}

/**
 * TimeRange class
 */
declare class TimeRange {

    /**
     * Constructs a TimeRange object
     */
    constructor();

    /**
     * Constructs a TimeRange object from start and end TickTime objects.
     */
    static createWithStartAndEnd(startTime: TickTime, endTime: TickTime): TimeRange;

    /**
     * Returns the duration of the TimeRange object
     */
    getDuration(): object;

    /**
     * Returns the end time of the TimeRange object
     */
    getEndTime(): object;

    /**
     * Returns the start time of the TimeRange object
     */
    getStartTime(): object;

    /**
     * Returns a new TimeRange with its start and end times aligned to the given FrameRate. The start time is aligned towards zero and the end time is aligned to the next frame greater than or equal to the end time. This TimeRange is not modified.
     */
    alignToFrame(frameRate: FrameRate): TimeRange;

    /**
     * Returns true if the given point in time is within the TimeRange.
     */
    contains(time: TickTime): boolean;

    /**
     * Returns true if the given TimeRange is equal to this TimeRange.
     */
    equals(other: TimeRange): boolean;

    /**
     * Returns a new TimeRange extended (or shrunk, if the given time is negative) by the given time on both sides. This TimeRange is not modified.
     */
    extend(time: TickTime): TimeRange;

    /**
     * Returns a new TimeRange which is the intersection of this range and the given range. If no intersection exists, an invalid TimeRange is returned. This TimeRange is not modified.
     */
    intersection(other: TimeRange): TimeRange;
}

/**
 * Mezzanine Timecode Object
 */
declare class Timecode {

    /**
     * Read|Write property to get|set prefer drop frame of timecode object
     */
    preferDropFrame: boolean;

    /**
     * Read|Write property to get|set start time of timecode object
     */
    startTime: object;

    /**
     * Construct a Timecode Object with parameters for StartTime and PreferDropFrame
     */
    constructor(StartTime: object, PreferDropFrame: boolean);

    /**
     * Returns true if the given TimecodeObject is equal to this TimecodeObject
     */
    equals(TimecodeObject: TimecodeObject): boolean;
}

/**
 * Timeout class
 */
declare class Timeout {

    static addEventListener(): any;

    /**
     * Construct a new Timeout object
     */
    constructor(milliseconds: number);

    static dispatchEvent(): any;
    static removeEventListener(): any;
}

/**
 * Event will be triggered to support setTimeout.
 */
declare interface TimeoutEventObject {
}

/**
 * Track class
 */
declare interface Track {

    name: string;
    index: number
    numItems: number
    numTransitions: number
    numComponents: number

    /**
     * index of clip along track, including gaps
     */
    getItemAt(index: number): QETrackItem
    getTransitionAt(index: number): any
    setName(): any
    insert(): any
    overwrite(): any
    addAudioEffect(): any
    getComponentAt(): any
    razor(timecode: string, p1?: boolean, p2?: boolean): any
    setLock(): any
    isLocked(): boolean;
    setSyncLock(): any
    isSyncLocked(): boolean

    setMute(uArg1?: number): boolean;
    isMuted(): boolean;

    readonly clips: TrackItemCollection;
    readonly id: number;
    readonly mediaType: string;
    readonly transitions: TrackItemCollection;
    bind(eventName: string, function_: any): void

    /**
     * Inserts a clip relative to the time of the last item on that track
     */
    insertClip(clipProjectItem: ProjectItem, time: number): boolean

    /**
     * Overwrites a clip at an absolute time on a track
     */
    overwriteClip(clipProjectItem: ProjectItem, time: number | Time): boolean

    setLocked(uArg1?: number): boolean;
    setTimeout(eventName: string, function_: any, milliseconds: number): void
    isTargeted(): boolean;

    setTargeted(isTargeted: boolean, shouldBroadcast: boolean): boolean
    unbind(eventName: string): void
}

/**
 * TrackCollection class
 */
declare interface TrackCollection {

    /**
     * Returns the number of tracks.
     */
    readonly numTracks: number;

    bind(eventName: string, function_: any): void

    setTimeout(eventName: string, function_: any, milliseconds: number): void

    unbind(eventName: string): void

    /**
     * Returns a track object.
     */
    readonly [index: number]: Track;

    /**
     * Returns the number of tracks.
     */
    readonly length: number;
}

/**
 * TrackItem class
 */
declare class TrackItem {

    readonly components: ComponentCollection;
    readonly duration: Time;
    readonly nodeId: string;

    end: Time | undefined
    inPoint: Time | undefined
    outPoint: Time | undefined
    readonly matchName: string;
    readonly mediaType: string;
    name: string;
    /**
     * @version 22.0
     */
    disabled: boolean;
    /**
     * @version 22.0
     */
    readonly parentTrackIndex: number;
    projectItem: ProjectItem;
    start: Time | undefined
    bind(eventName: string, function_: any): void
    readonly type: number;
    getLinkedItems(): TrackItemCollection;
    getMatchName(): string;
    isMGT(): boolean;
    isSelected(): boolean;
    isSpeedReversed(): 0 | 1

    setSelected(isSelected: boolean, updateUI?: boolean): boolean;
    isAdjustmentLayer(): boolean;

    remove(rippleEdit: boolean, alignToVideo: boolean): boolean
    getSpeed(): number;
    getMGTComponent(): Component;
    getColorSpace(): String

    /**
     * Move the track item by the specified time along the track. It will not move any linked media (like linked audio)
     * @param time Can be given as a number in seconds, a string representing ticks, or a {@link Time} object.
     */
    move(time: Time | number | string): boolean | undefined
    setTimeout(eventName: string, function_: any, milliseconds: number): void
    unbind(eventName: string): void
    setMappingForChannel(uArg1: number, uArg2: number): boolean;
}

/**
 * TrackItemCollection class
 */
declare interface TrackItemCollection {

    /**
     * Returns the number of track items.
     */
    readonly numItems: number;

    bind(eventName: string, function_: any): void

    setTimeout(eventName: string, function_: any, milliseconds: number): void

    unbind(eventName: string): void

    /**
     * Returns a track item object.
     */
    readonly [index: number]: TrackItem;

    /**
     * Returns the number of track items.
     */
    readonly length: number;

    readonly numTracks: number;
}

/**
 * The Transcoder object provides the main access for full export settings information and control.
 */
declare interface Transcoder {

    /**
     * Returns color management info.
     */
    readonly colorManagementInfo: string;

    /**
     * Returns the JSON for the current selected destination.
     */
    readonly currentDestination: string;

    /**
     * Returns the logged-in state of the current selected destination. Returns 'false', if we can't determine logged-in state (MediaFile, CreativeCloud, FTP).
     */
    readonly currentDestinationIsLoggedIn: boolean;

    /**
     * Returns the list and names of the current Preset Setting Groups.
     */
    readonly currentPresetSettingsGroups: string;

    /**
     * Get the currently selected source masterclip(s).
     */
    readonly currentSourceMasterClips: Array<any>;

    /**
     * Get the currently selected source sequence.
     */
    readonly currentSourceSequence: Sequence;

    /**
     * Returns a JSON list of all destinations for an export.
     */
    readonly destinations: string;

    /**
     * Returns the calculated file size information for the current source with the selected Preset.
     */
    readonly estimatedFileSize: string;

    /**
     * Start a direct, modal Export with all for export marked destinations of the current Transcoder settings.
     */
    readonly exportDestinationsDirect: boolean;

    /**
     * Start a direct, modal Export with the current Transcoder settings.
     */
    readonly exportDirect: boolean;

    /**
     * Returns the current JSON convert option for hide hidden params.
     */
    readonly getJSONConvertOptionIncludeHiddenParams: boolean;

    /**
     * Returns the current JSON convert option for hide unset values.
     */
    readonly getJSONConvertOptionIncludeUnsetValues: boolean;

    /**
     * Returns the import into Project preference value.
     */
    readonly importIntoProject: boolean;

    /**
     * Check if match Sequence settings are allowed.
     */
    readonly isMatchSequenceSettingsAllowed: boolean;

    /**
     * Returns the locked status of the output file.
     */
    readonly isOutputFilePathLocked: boolean;

    /**
     * Returns the match Sequence settings value.
     */
    readonly matchSequenceSettings: boolean;

    /**
     * Check if the original applied preset contains any enabled publish settings. Publish settings will be controlled by the destination settings which overwrites any original preset publish settings.
     */
    readonly originPresetHasEnabledPublishGroups: boolean;

    /**
     * Returns the path to the output file.
     */
    readonly outputFilePath: string;

    /**
     * Returns the current selected Preset Actions Settings.
     */
    readonly presetActionsGroupSettings: string;

    /**
     * Returns the current selected Preset Audio Settings.
     */
    readonly presetAudioGroupSettings: string;

    /**
     * Returns the current selected Preset Caption Settings.
     */
    readonly presetCaptionGroupSettings: string;

    /**
     * Returns the current selected Preset Effects Settings.
     */
    readonly presetEffectsGroupSettings: string;

    /**
     * Returns the current selected Preset Ingest Settings.
     */
    readonly presetIngestGroupSettings: string;

    /**
     * Returns the current selected Preset Metadata Settings.
     */
    readonly presetMetadataGroupSettings: string;

    /**
     * Returns the current selected Preset Publish Settings.
     */
    readonly presetPublishGroupSettings: string;

    /**
     * Returns the current selected Preset Video Settings.
     */
    readonly presetVideoGroupSettings: string;

    /**
     * Get the current Range Option: Entire(0), InToOut(1), WorkArea(2), Custom(3), Default(4).
     */
    readonly rangeOption: number;
    /**
     * Get the current Scaling Option: Scale to fit(0), Scale to fill(3), Stretch to fill(5).
     */
    readonly scalingOption: number;

    /**
     * Returns a JSON list of the currently selected source object.
     */
    readonly sourceSelection: string;

    /**
     * Change the export format, selected preset will be reset to the default preset for a given format.
     */
    changeFormat(newFormat: string): boolean;

    /**
     * Change match source state for the given Parameter.
     */
    changeMatchSource(id: string, value: boolean): boolean;

    /**
     * Change an existing Parameter.
     */
    changeParameter(group: string, id: string, value: string): boolean;

    /**
     * Returns the information about the current, selected Preset.
     */
    currentPresetInfo(includeSettings: boolean): string;

    /**
     * Returns the current selected Preset settings from a special group.
     */
    currentPresetSettingsForGroup(groupKey: string): string;

    /**
     * Export the current Preset.
     */
    exportCurrentPresetTo(filePath: string, presetComments: string): boolean;

    /**
     * Get the aspect ratio lock state.
     */
    getAspectRatioLock(): boolean;

    /**
     * Returns the localized display string for Output Summary, when content credentials are applied.
     */
    getContentCredentialsApplyDisplayString(): string;

    /**
     * Returns true if the current selection (sequence or project items) contains content credentials.
     */
    hasContentCredentials(): boolean;

    /**
     * Returns true if the export of content credentials (cr) is activated
     */
    isExportCRActivated(): boolean;

    /**
     * Returns true if the export format is supported by content credentials (cr)
     */
    isFormatSupportedByCR(): boolean;

    /**
     * Returns the full path to a selected file
     */
    saveAsDialog(defaultDir: string, defaultFileName: string, extension: string): string;

    /**
     * Returns the full path to a selected file
     */
    saveAsDialogWithFullPath(fullPathWithExtension: string): string;

    /**
     * Save a custom preset.
     */
    saveCustomPreset(presetName: string, saveEffectSettings: boolean, savePublishSettings: boolean): boolean;

    /**
     * Select a new destination.
     */
    selectDestination(destID: string, groupIndex: number): boolean;

    /**
     * Set the aspect ratio lock state.
     */
    setAspectRatioLock(value: boolean): boolean;

    /**
     * Set currently selected Preset.
     */
    setCurrentPreset(presetID: string): boolean;

    /**
     * Set new Custom Data to the destination to store plugin or UI related information for this destination as JSON.
     */
    setDestinationCustomData(destID: string, groupIndex: number, customData: string): boolean;

    /**
     * Set the import into Project preference value.
     */
    setImportIntoProject(importExportedFile: boolean): boolean;

    /**
     * Set the JSON return parameter for this class. Hide Hidden doesn't expose not UI visible params. Hide Unset returns smaller JSON by not exposing the parameter when set to default (e.g. disable = false will not expose, but disable = true will). Will return true then an options has changed.
     */
    setJSONConvertOptions(includeHiddenParams: boolean, includeUnsetValues: boolean): boolean;

    /**
     * Set the Sequence settings as Preset.
     */
    setMatchSequenceSettings(matchSequenceSettings: boolean): boolean;

    /**
     * Set the new path to the output file. The filename can be made unique based on other files already on disk.
     */
    setOutputFilePath(filePath: string, createUniqueFilename: boolean): boolean;

    /**
     * Set the current Range Option: Entire(0), InToOut(1), WorkArea(2), Custom(3), Default(4).
     */
    setRangeOption(rangeOption: number): boolean;

    /**
     * Set the current Scaling Option: Scale to fit(0), Scale to fill(3), Stretch to fill(5).
     */
    setScalingOption(scalingOption: number): boolean;

    /**
     * Returns output filepath collision type for a given filepath. There could be no collision, collision with another destination or collision with existing file on disk.
     */
    validateOutputFilePathCollisions(filePath: string): number;

    /**
     * Returns true if the current selection (sequence or project items) will be signed with content credentials.
     */
    willSignWithContentCredentials(): boolean;

    /**
     * Returns JSON describing whether the selected format cannot match the source audio channelization, plus source/output channel counts.
     */
    readonly matchSourceAudioChannelMismatch: string;
}

/**
 * Transcoder event object
 */
declare class TranscoderEvent {

    /**
     * A new (publish) destination was selected.
     */
    static readonly EVENT_DESTINATIONSELECTED: string;

    /**
     * Exported File size needs an update.
     */
    static readonly EVENT_DISKSPACEREQUIREMENTCHANGED: string;

    /**
     * The export range option changed.
     */
    static readonly EVENT_EXPORTWORKAREACHANGED: string;

    /**
     * The export format has changed.
     */
    static readonly EVENT_FORMATCHANGED: string;

    /**
     * A new event is generated
     */
    static readonly EVENT_NEWEVENTGENERATED: string;

    /**
     * The output filename has changed and needs to be updated.
     */
    static readonly EVENT_OUTPUTFILENAMECHANGED: string;

    /**
     * A new preset is selected.
     */
    static readonly EVENT_SELECTNEWPRESET: string;

    /**
     * Export Warning should be displayed. EventInfo contains the warning message.
     */
    static readonly EVENT_SHOWEXPORTWARNING: string;

    /**
     * Settings changed and all settings needs to be updated.
     */
    static readonly EVENT_UPDATEALLSETTINGS: string;

    /**
     * One Parameter or Parameter Group changed. EventInfo contains the changed parameter ID.
     */
    static readonly EVENT_UPDATEDEPENDENCIES: string;

    /**
     * Additional info as string or JSON if required by this event. Otherwise empty.
     */
    readonly eventInfo: string;

    static addEventListener(): any;
    static dispatchEvent(): any;
    static removeEventListener(): any;
}

/**
 * The TypeReflection object provides information about the behavior of type of a property.
 */
declare interface TypeReflection {

    /**
     * true if it is an array type.
     */
    readonly arrayType: boolean;

    /**
     * The type name.
     */
    readonly name: string;

    /**
     * true if the value could be undefined.
     */
    readonly optionalType: boolean;
}

/**
 * UPXHost class provides private functionality to interact with the host from the plugin
 */
declare class UXPHost {

    /**
     * Returns a vector of namespaces - a union of those provided as default by the host and defined in the manifest of the plugin
     */
    static getNamespacesForPluginId(pluginId: string): string[];

    /**
     * Returns the file system path of a UXP plugin given its plugin ID
     */
    static getPathFromPluginId(pluginId: string): string;
}

/**
 * High level interface object that gives access to the UniversalSearchAPI Layer
 */
declare class UniversalSearchAPI {

    /**
     * Sort result values in ascending order.
     */
    static readonly ORDER_ASCENDING: number;

    /**
     * Sort result values in descending order.
     */
    static readonly ORDER_DESCENDING: number;

    /**
     * Sort result values by duration.
     */
    static readonly SORT_DURATION: number;

    /**
     * Sort result values by name.
     */
    static readonly SORT_NAME: number;

    /**
     * Sort result values by score.
     */
    static readonly SORT_SCORE: number;

    /**
     * Sort result values by time.
     */
    static readonly SORT_TIME: number;

    /**
     * Return the facets that are provided by this set of search results.
     */
    findAll(query: object, pageOptions: object, searchOptions: object, uArg1: any): object;

    /**
     * Get an object representing the universal search API backend
     */
    static getInstance(): object;
}

/**
 * Query that can be used in connection with the universal search API
 */
declare class UniversalSearchQuery {

    /**
     * AND operator for field queries.
     */
    static readonly BOOLEAN_FIELD_OPERATOR_AND: number;

    /**
     * OR operator for field queries.
     */
    static readonly BOOLEAN_FIELD_OPERATOR_OR: number;

    /**
     * Find fields that contain the given content.
     */
    static readonly FIELD_QUERY_CONTAINS: number;

    /**
     * Find fields that end with the given content.
     */
    static readonly FIELD_QUERY_ENDS_WITH: number;

    /**
     * Find fields that equal the given content.
     */
    static readonly FIELD_QUERY_EQUALS: number;

    /**
     * Find fields that start with the given content.
     */
    static readonly FIELD_QUERY_STARTS_WITH: number;

    readonly description: string;

    /**
     * Constructs a filter query that only enables agents other then the given agents.
     */
    static createAgentDisallowFilterQuery(disallowedAgents: string[], subQuery: object): object;

    /**
     * Constructs a filter query that only enables the given agents.
     */
    static createAgentFilterQuery(agents: string[], subQuery: object): object;

    /**
     * Constructs a text query that searches on agents for the given text.
     */
    static createAgentTextQuery(queryText: string): object;

    /**
     * Constructs a field query consisting of a vector of {schema:string, property:string, content:string, operator:FIELD_QUERY_CONTAINS|FIELD_QUERY_EQUALS|FIELD_QUERY_STARTS_WITH|FIELD_QUERY_ENDSWITH} objects that can be used to query e.g. the metadata search index for path based queries. The second parameter is an operator (BOOLEAN_FIELD_OPERATOR_AND|BOOLEAN_FIELD_OPERATOR_OR) for the metadata search aggregation which can be either
     */
    static createFieldQuery(fieldSpecs: Array<any>, operator: number): object;

    /**
     * Constructs a merge query that merges results from multiple subqueries. Merge queries will not perform any deduplication. Results from all subqueries are merged into one final output result set.
     */
    static createMergeQuery(subQueries: Array<any>): object;

    /**
     * Constructs a join query that joins results from 2 subqueries on a set of given paths. The join operation will be successful if the same objects exist under the same pathes for both objects and return a joined object with all paths merged in that case. Otherwise the join operation will fail.A path is a <dot> seperated string that represents the path to the object in the result object. e.g. key1.key2.key3
     */
    static createPathJoinQuery(leftQuery: object, rightQuery: object, keyPaths: string[]): object;

    /**
     * Constructs a query from a valid query JSON file.
     */
    static createQueryFromJSON(jsonString: string): object;

    /**
     * Constructs a join query that joins results from 2 subqueries on the universal search result object hash. Meaning that two results will be joined if and only if the refer to the same object within the host
     */
    static createUniversalJoinQuery(leftQuery: object, rightQuery: object): object;
}

/**
 * Result object that represents one search result in the universal search API. Search results can refer to any entity within the application. Source Clips, Markers, Commands etc. It is up to the client to interpret the result based on the provided type and payload.
 */
declare interface UniversalSearchResult {

    /**
     * The identifier of the search agent that was used to create this result.
     */
    readonly agent: string;

    /**
     * Return the facets that are provided by this search result.
     */
    readonly facets: object;

    /**
     * The hash of this search results. Identical hashes lead to the exact same rendition of an item in the UI.
     */
    readonly hash: object;

    /**
     * The payload of the search result in JSON string format. The payload contains all data that is needed to get the actual referenced object of this search result.
     */
    readonly payload: string;

    /**
     * The score for the search result in range [0,1]. Higher numbers indicate a better match. Search agents that only match on exact hits will only return 1.0 as score for best matches.
     */
    readonly score: number;

    /**
     * The type of this search result. This can be e.g. 'MasterClip' 'Marker'...
     */
    readonly type: string;

    /**
     * The hash of the object this search results is referring to. Generally, if two search results are referencing the same object, regardless of modality or details they will feature an identical universalJoinHash. A good example would be the same project item referenced by metadata and transcript search would lead to the same universalJoinHash.
     */
    readonly universalJoinHash: object;
}

/**
 * A collection of universal search results
 */
declare interface UniversalSearchResults {

    /**
     * Return the facets that are provided by this set of search results.
     */
    readonly facets: object;

    /**
     * The individual results provided by this results object that match the given facet.
     */
    readonly results: Array<any>;

    /**
     * Returns the result codes for failed agents, segmented by agent in JSON format of pairs {agent, errorCode}. If an error occurred, the error message can be retrieved using getLocalizedErrorMessageForAgent.
     */
    getErrors(): object;

    /**
     * The individual results provided by this results object that match the given facet. The facet vector can be empty in which case all existing search results will be returned.
     */
    getFacetedResults(facets: string[]): Array<any>;

    /**
     * If the search for this result set failed, this call returns a localized error message in the current application language that can be presented to the user. In case search was successful, this call returns an empty string. Agents do not have to provide a localized error message in which case this function will return a generic error message saying "Search failed with code: <result code>"
     */
    getLocalizedErrorMessageForAgent(agentIdentifier: string): string;
}

/**
 * Algebra BLAS data class
 */
declare class Vector {

    /**
     * Get number of columns in this data object.
     */
    readonly cols: number;

    /**
     * Get the length of the vector.
     */
    readonly length: number;

    /**
     * Get number of rows in this data object.
     */
    readonly rows: number;

    /**
     * Get the value at the given row index.
     */
    at(rowIdx: number, ColIdx: number): number;

    /**
     * Constructs a new BLAS Vector object.
     */
    constructor(rows: number, data: number[]);

    /**
     * Compute the dot product of this vector with another.
     */
    dot(other: object): number;

    /**
     * Compute the norm of this vector or matrix.
     */
    norm(): number;

    /**
     * Element-wise absolute value; returns a new vector or matrix.
     */
    abs(): object;

    /**
     * Element-wise add another vector or matrix of the same shape; returns a new vector or matrix.
     */
    add(other: object): object;

    /**
     * Get the linear (column-major) index of the maximum element.
     */
    argMax(): number;

    /**
     * Element-wise divide by another vector or matrix of the same shape; returns a new vector or matrix.
     */
    divide(other: object): object;

    /**
     * Get the maximum element value in this vector or matrix.
     */
    max(): number;

    /**
     * Element-wise maximum of each element and the given scalar; returns a new vector or matrix.
     */
    maximum(scalar: number): object;

    /**
     * Element-wise multiply by another vector or matrix of the same shape; returns a new vector or matrix.
     */
    multiply(other: object): object;

    /**
     * Element-wise power; returns a new vector or matrix.
     */
    pow(exponent: number): object;

    /**
     * Multiply each element by the given scalar; returns a new vector or matrix.
     */
    scale(factor: number): object;

    /**
     * Compute the squared L2 norm of this vector or matrix.
     */
    squaredNorm(): number;

    /**
     * Element-wise subtract another vector or matrix of the same shape; returns a new vector or matrix.
     */
    subtract(other: object): object;

    /**
     * Compute the sum of all elements in this vector or matrix.
     */
    sum(): number;
}

/**
 * Represents a wave file on disk and can be used to retrieve basic metadata.
 */
declare class WaveFile {

    /**
     * The bit depth of the referenced wave file.
     */
    readonly bitDepth: number;

    /**
     * The channel layout of the referenced wave file.
     */
    readonly channelLayout: object;

    /**
     * The file path of the referenced wave file.
     */
    readonly filePath: string;

    /**
     * The sample count of the referenced wave file.
     */
    readonly sampleCount: number;

    /**
     * The sample rate of the referenced wave file.
     */
    readonly sampleRate: number;

    /**
     * Create a new wave file object referencing a file on disk.
     */
    constructor(filePath: string);
}

/**
 * ZString class provides access to localized version of a string.
 */
declare class ZString {

    /**
     * Get localized value for a loc-key.
     */
    static getZString(locKey: string): string;

    /**
     * Get localized value for a loc-key.
     */
    static getZStringAndReplace(locKey: string, stringSubstitutions: string[]): string;
}

declare namespace dvappsupport {
    /**
     * Spell check event object for sending broadcast messages to script env
     */
    declare interface spellcheckupdate {

        /**
         * Get what word was added|removed from the dictionary
         */
        readonly misspelledWord: string;

        /**
         * Whether spellcheck is enabled or not (allow broadcast to send spellcheck enabled change)
         */
        readonly spellcheckEnabled: boolean;

        /**
         * Get whether a word was added to (true) or removed from (false) the dictionary
         */
        readonly wordAdded: boolean;
    }

}

declare enum WorkAreaType {
    ENCODE_ENTIRE = 0,
    ENCODE_IN_TO_OUT = 1,
    ENCODE_WORK_AREA = 2,
}

interface $ {
    _PPP_: any
}

interface Collection<T> {
    readonly length: number
    readonly [index: number]: T
}

declare class Metadata {
    readonly getMetadata: string

    addMarker(): void

    bind(eventName: string, function_: any): void

    deleteMarker(): void

    setMarkerData(): void

    setMetadataValue(): void

    setTimeout(eventName: string, function_: any, milliseconds: number): void

    unbind(eventName: string): void

    updateMarker(): void
}

declare class CsxsResourceCentral {
    bind(eventName: string, function_: any): void

    getBrightness(): string

    openURL(urlString: string): void

    setTimeout(eventName: string, function_: any, milliseconds: number): void

    unbind(eventName: string): void

    validateClient(token: string): boolean
}

declare class Csxs {
    readonly resourceCentral: CsxsResourceCentral

    bind(eventName: string, function_: any): void

    setTimeout(eventName: string, function_: any, milliseconds: number): void

    unbind(eventName: string): void
}

type NumericalBool = 0 | 1

/**
 * Options are:
 * - `228CDA18-3625-4d2d-951E-348879E4ED93`: Video
 * - `80B8E3D5-6DCA-4195-AEFB-CB5F407AB009`: Audio
 * - `FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF`: Any
 */
type MediaType = "Video" | "Audio" | "any"

type SampleRateOption = 48000 | 96000

type BitsPerSampleOption = 16 | 24

type SDKEventType = "warning" | "info" | "error"

/**
 * Video time display formats.
 */
type VideoTimeDisplay =
    | 100 /** TIMEDISPLAY_24Timecode: Timecode 24 fps. */
    | 101 /** TIMEDISPLAY_25Timecode: Timecode 25 fps. */
    | 102 /** TIMEDISPLAY_2997DropTimecode: Timecode 29.97 fps, drop frame. */
    | 103 /** TIMEDISPLAY_2997NonDropTimecode: Timecode 29.97 fps, non-drop frame. */
    | 104 /** TIMEDISPLAY_30Timecode: Timecode 30 fps. */
    | 105 /** TIMEDISPLAY_50Timecode: Timecode 50 fps. */
    | 106 /** TIMEDISPLAY_5994DropTimecode: Timecode 59.94 fps, drop frame. */
    | 107 /** TIMEDISPLAY_5994NonDropTimecode: Timecode 59.94 fps, non-drop frame. */
    | 108 /** TIMEDISPLAY_60Timecode: Timecode 60 fps. */
    | 109 /** TIMEDISPLAY_Frames: Frames. */
    | 110 /** TIMEDISPLAY_23976Timecode: Timecode 23.976 fps. */
    | 111 /** TIMEDISPLAY_16mmFeetFrames: 16mm Feet+Frames. */
    | 112 /** TIMEDISPLAY_35mmFeetFrames: 35mm Feet+Frames. */
    | 113 /** TIMEDISPLAY_48Timecode: Timecode 48 fps. */

type AudioTimeDisplay =
    | 200 /** TIMEDISPLAY_AudioSamplesTimecode: Audio Samples. */
    | 201 /** TIMEDISPLAY_AudioMsTimecode: Audio Milliseconds. */;

/**
 * @See {@link VideoTimeDisplay} and {@link AudioTimeDisplay}
 */
type TIME_FORMAT =
    | VideoTimeDisplay
    | AudioTimeDisplay

type InterpolationType =
    | 0 /** KF_Interp_Mode_Linear */
    | 1 /** kfInterpMode_EaseIn_Obsolete */
    | 2 /** kfInterpMode_EaseOut_Obsolete */
    | 3 /** kfInterpMode_EaseInEaseOut_Obsolete */
    | 4 /** KF_Interp_Mode_Hold */
    | 5 /** KF_Interp_Mode_Bezier */
    | 6 /** KF_Interp_Mode_Time */
    | 7 /** kfInterpMode_TimeTransitionStart */
    | 8 /** kfInterpMode_TimeTransitionEnd */

type EncoderEvent =
    | "onEncoderJobCanceled"
    | "onEncoderJobQueued"
    | "onEncoderJobComplete"
    | "onEncoderJobError"
    | "onEncoderJobProgress"
    | "onEncoderLaunched"

type ApplicationEvent =
    | "onSourceClipSelectedInProjectPanel"
    | "onSequenceActivated"
    | "onActiveSequenceChanged"
    | "onActiveSequenceSelectionChanged"
    | "onActiveSequenceTrackItemAdded"
    | "onActiveSequenceTrackItemRemoved"
    | "onActiveSequenceStructureChanged"
    | "onProjectChanged"
    | "onProjectEndDrop"

declare const document: Document

interface CodeProfiler {
    start(): any
    stop(): any
    reset(): any
    get(): any
}

interface VideoEffect {
    name: string
}

interface QESequenceItem {
    name: string
    openInSource(): any
    isPending(): boolean
    isAudioConforming(): boolean
    isIndexing(): boolean
    isAudioPeakGenerating(): boolean
}

interface QESource {
    player: QEPlayer
    clip: QEMasterClip
    openFilePath(): any
}

interface Multicam {
    play(): any
    stop(): any
    changeCamera(): any
    record(): any
    enable(): any
}

/**
 * Options are:
 * - `0`: Mono
 * - `1`: Stero
 * - `2`: 5.1
 * - `3`: Multichannel
 * - `4`: 4 Channel
 * - `5`: 8 Channel
 *
 */
type AudioChannelType = 0 | 1 | 2 | 3 | 4 | 5

type ExportFrameExtension =
    | "dpx" | "png" | "tga" | "jpg"
    | "tif" | "bmp" | "gif" | "exr"

declare const qe: undefined | QEApplication

/**
 * The AudioFilterIDs object exposes the AudioFilterIDs as read-only string constants.
 */
declare class AudioFilterIDs {

    /**
     * Accusonus Denoise filter ID.
     */
    static readonly ACCUSONUS_DENOISE: string;

    /**
     * Accusonus Dereverb filter ID.
     */
    static readonly ACCUSONUS_DEREVERB: string;

    /**
     * Adaptive Noise Reduction filter ID.
     */
    static readonly ADAPTIVE_NOISE_REDUCTION: string;

    /**
     * Ambisonics Binauralizer filter ID.
     */
    static readonly AMBISONICS_BINAURALIZER: string;

    /**
     * Ambisonics Panner filter ID.
     */
    static readonly AMBISONICS_PANNER: string;

    /**
     * Amplify filter ID.
     */
    static readonly AMPLIFY: string;

    /**
     * Audio 4-to-6 channel converter ID.
     */
    static readonly AUDIO_4_TO_6_CHANNEL_CONVERTER: string;

    /**
     * Balance filter ID.
     */
    static readonly AUDIO_BALANCE: string;

    /**
     * Bandpass filter ID.
     */
    static readonly AUDIO_BAND_PASS: string;

    /**
     * Bandreject filter ID.
     */
    static readonly AUDIO_BAND_REJECT: string;

    /**
     * Bass filter ID.
     */
    static readonly AUDIO_BASS: string;

    /**
     * Channel Volume filter ID.
     */
    static readonly AUDIO_CHANNEL_VOLUME: string;

    /**
     * Delay filter ID.
     */
    static readonly AUDIO_DELAY: string;

    /**
     * Fill Left filter ID.
     */
    static readonly AUDIO_FILL_LEFT: string;

    /**
     * Fill Right filter ID.
     */
    static readonly AUDIO_FILL_RIGHT: string;

    /**
     * Highpass filter ID.
     */
    static readonly AUDIO_HIGH_PASS: string;

    /**
     * Invert filter ID.
     */
    static readonly AUDIO_INVERT: string;

    /**
     * Lowpass filter ID.
     */
    static readonly AUDIO_LOW_PASS: string;

    /**
     * Mute filter ID.
     */
    static readonly AUDIO_MUTE: string;

    /**
     * Parametric EQ filter ID.
     */
    static readonly AUDIO_PARAMETRIC_EQ: string;

    /**
     * Swap Channels filter ID.
     */
    static readonly AUDIO_SWAP_CHANNEL: string;

    /**
     * Treble filter ID.
     */
    static readonly AUDIO_TREBLE: string;

    /**
     * Volume filter ID.
     */
    static readonly AUDIO_VOLUME: string;

    /**
     * Auto Click Remover filter ID.
     */
    static readonly AUTO_CLICK_REMOVER: string;

    /**
     * Channel Mixer filter ID.
     */
    static readonly CHANNEL_MIXER: string;

    /**
     * Dry|Wet Mixer filter ID.
     */
    static readonly DRY_WET_MIXER: string;

    /**
     * Dynamics filter ID.
     */
    static readonly DYNAMICS: string;

    /**
     * Enhance Audio Mixer filter ID.
     */
    static readonly ENHANCE_AUDIO_MIXER: string;

    /**
     * Enhance Speech filter ID.
     */
    static readonly ENHANCE_SPEECH: string;

    /**
     * Fast Hard Limiter filter ID.
     */
    static readonly FAST_HARD_LIMITER: string;

    /**
     * FFT Filter ID.
     */
    static readonly FFT_FILTER: string;

    /**
     * Flanger filter ID.
     */
    static readonly FLANGER: string;

    /**
     * Graphic EQ (10 bands) filter ID.
     */
    static readonly GRAPHIC_EQ_10_BANDS: string;

    /**
     * Graphic EQ (20 bands) filter ID.
     */
    static readonly GRAPHIC_EQ_20_BANDS: string;

    /**
     * Graphic EQ (30 bands) filter ID.
     */
    static readonly GRAPHIC_EQ_30_BANDS: string;

    /**
     * Hard Limiter filter ID.
     */
    static readonly HARD_LIMITER: string;

    /**
     * Legacy Hard Limiter filter ID.
     */
    static readonly HARD_LIMITER_LEGACY: string;

    /**
     * iZotope Analog Delay filter ID.
     */
    static readonly IZOTOPE_ANALOG_DELAY: string;

    /**
     * iZotope Chorus|Flanger filter ID.
     */
    static readonly IZOTOPE_CHORUS_FLANGER: string;

    /**
     * iZotope Convolution Reverb filter ID.
     */
    static readonly IZOTOPE_CONVOLUTION_REVERB: string;

    /**
     * iZotope De-Esser filter ID.
     */
    static readonly IZOTOPE_DE_ESSER: string;

    /**
     * iZotope De-Hummer filter ID.
     */
    static readonly IZOTOPE_DE_HUMMER: string;

    /**
     * iZotope Distortion filter ID.
     */
    static readonly IZOTOPE_DISTORTION: string;

    /**
     * iZotope Guitar Suite filter ID.
     */
    static readonly IZOTOPE_GUITAR_SUITE: string;

    /**
     * iZotope Multi-Band Compressor filter ID.
     */
    static readonly IZOTOPE_MULTI_BAND_COMPRESSOR: string;

    /**
     * iZotope Phaser filter ID.
     */
    static readonly IZOTOPE_PHASER: string;

    /**
     * iZotope Simple Mastering filter ID.
     */
    static readonly IZOTOPE_SIMPLE_MASTERING: string;

    /**
     * iZotope Single Band Compressor filter ID.
     */
    static readonly IZOTOPE_SINGLE_BAND_COMPRESSOR: string;

    /**
     * iZotope Surround Reverb filter ID.
     */
    static readonly IZOTOPE_SURROUND_REVERB: string;

    /**
     * iZotope Tube-Modeled Compressor filter ID.
     */
    static readonly IZOTOPE_TUBE_MODELED_COMPRESSOR: string;

    /**
     * iZotope Vocal Enhancer filter ID.
     */
    static readonly IZOTOPE_VOCAL_ENHANCER: string;

    /**
     * Latency Generator filter ID.
     */
    static readonly LATENCY_GENERATOR: string;

    /**
     * Loudness Meter filter ID.
     */
    static readonly LOUDNESS_METER: string;

    /**
     * Multitap Delay filter ID.
     */
    static readonly MULTITAP_DELAY: string;

    /**
     * Notch Filter ID.
     */
    static readonly NOTCH_FILTER: string;

    /**
     * Parametric Dynamics filter ID.
     */
    static readonly PARAMETRIC_DYNAMICS: string;

    /**
     * Parametric EQ filter ID.
     */
    static readonly PARAMETRIC_EQ: string;

    /**
     * Pitch Shift filter ID.
     */
    static readonly PITCH_SHIFT: string;

    /**
     * Scientific Filter ID.
     */
    static readonly SCIENTIFIC_FILTER: string;

    /**
     * Single Band Dynamics filter ID.
     */
    static readonly SINGLE_BAND_DYNAMICS: string;

    /**
     * Sliding Window Normalizer filter ID.
     */
    static readonly SLIDING_WINDOW_NORMALIZER: string;

    /**
     * Sound Lift filter ID.
     */
    static readonly SOUND_LIFT: string;

    /**
     * Spectrum Meter filter ID.
     */
    static readonly SPECTRUM_METER: string;

    /**
     * Stereo Expander filter ID.
     */
    static readonly STEREO_EXPANDER: string;

    /**
     * Studio Reverb filter ID.
     */
    static readonly STUDIO_REVERB: string;

    /**
     * TC Radar Meter component ID.
     */
    static readonly TC_RADAR_METER_COMPONENT: string;
}

/**
 * Provides several utility methods including batch commands to run, pause or stop the batch.
 */
declare interface EncoderHostScriptObject {

    /**
     * Returns an 'EncoderWrapper' script object for the requested format.
     */
    createEncoderForFormat(inFormatName: string): object;

    /**
     * Returns the current status of the batch encoder. The values are: invalid, paused, running, stopped, stopping (available since 23.3).
     */
    getBatchEncoderStatus(arg1: string): string;

    /**
     * Writes out the current batch preview image (tiff format) to the given path.
     * @param inOutputPath Path to store a 'tiff' file.
     */
    getCurrentBatchPreview(inOutputPath: string): boolean;

    /**
     * Returns a list of all available formats.
     */
    getFormatList(): string[];

    /**
     * Returns a 'SourceMediaInfo' script object which can give detailed info about the provided source.
     * @param sourcePath Media path
     */
    getSourceInfo(sourcePath: string): SourceMediaInfo;

    /**
     * Returns list of all available formats.
     */
    getSupportedImportFileTypes(): string[];

    /**
     * Returns true if a batch job is running.
     */
    isBatchRunning(): boolean;

    /**
     * Pauses the batch (always returns true). ### Todo: Do we want to return a result when e.g. the batch was already paused or something went wrong?
     */
    pauseBatch(arg1: boolean): boolean;

    /**
     * Runs the batch (always returns true). ### Todo: Do we want to return a result when e.g. the batch was already running or something went wrong?
     */
    runBatch(arg1: boolean): boolean;

    /**
     * Stops the batch (always returns true). ### Todo: Do we want to return a result when e.g. the batch was already stopped or something went wrong?
     */
    stopBatch(arg1: boolean): boolean;
}

/**
 * Provides the following event types for items in the batch queue: onItemEncodingStarted, onAudioPreEncodeProgress, onEncodingItemProgressUpdate, onItemEncodeComplete.For multiple batch items in the queue we recommend to use this event to ensure that the event types will be received for all batch items.It provides the following event type for the whole batch queue: onBatchEncoderStatusChanged.
 */
declare class EncoderHostWrapperEvent {

    /**
     * Returns the audio pre-encoding info for the event type onAudioPreEncodeProgress (available since 24.0).
     */
    readonly audioInfo: string;

    /**
     * Returns the audio pre-encoding progress for the event type onAudioPreEncodeProgress (available since 24.0).
     */
    readonly audioProgress: number;

    /**
     * Returns the status of the batch encoder, when the event was sent. Can be called for onBatchEncoderStatusChanged event, otherwise the status will be invalid. The values are: invalid, paused, running, stopped, stopping (available since 23.3).
     */
    readonly batchEncoderStatus: string;

    /**
     * Notify when the audio pre-encode progress changes (available since 24.0).
     */
    static readonly onAudioPreEncodeProgress: string;

    /**
     * Notify when the batch encoder status has changed. Get the new status from the batchEncoderStatus property. (available since 23.3)
     */
    static readonly onBatchEncoderStatusChanged: string;

    /**
     * Notify of the batch item encoding progress (available since 23.1).
     */
    static readonly onEncodingItemProgressUpdate: string;

    /**
     * Notify when the batch item has been encoded.
     */
    static readonly onItemEncodeComplete: string;

    /**
     * Notify when the batch item encoding started (available since 23.1).
     */
    static readonly onItemEncodingStarted: string;

    /**
     * Returns the path of the output file. Can be called for onItemEncodingStarted and onItemEncodeComplete events.
     */
    readonly outputFilePath: string;

    /**
     * Returns the encoding progress between 0 and 1. Can be called for onEncodingItemProgressUpdate event.
     */
    readonly progress: number;

    /**
     * Returns the encoding result 'True' or 'False'. Can be called for onItemEncodeComplete event.
     */
    readonly result: string;

    /**
     * Returns the path of the source file. Can be called for onItemEncodingStarted and onItemEncodeComplete events.
     */
    readonly sourceFilePath: string;

    static addEventListener(): any;
    static dispatchEvent(): any;
    static removeEventListener(): any;
}

/**
 * Opaque handle for GenExtend params pending dispatch, produced by GenExtend.appendGenExtendTransitionMissingFramesAction
 */
declare class GenExtendParams {

    /**
     * Holds GenExtend params pending dispatch
     */
    constructor();

    /**
     * True when there was nothing to generate (neither side needed frames)
     */
    isEmpty(): boolean;
}

/**
 * Scripting bridge for Generative Music job submission and result inspection
 */
declare class GenMusic {

    /**
     * Creates a GenMusic object
     */
    constructor();

    /**
     * Trigger a Generative Music job for the given range on an audio track
     */
    static createGenMusicJob(sequence: object, targettrack: object, starttime: object, durationseconds: number, prompt: string, beatsperminute: number, loop: boolean): boolean;

    /**
     * Trigger a Generative Music job using the video clip above the range as reference (Beta)
     */
    static createGenMusicJobUnderVideo(sequence: object, targettrack: object, starttime: object, durationseconds: number, prompt: string, beatsperminute: number, loop: boolean): boolean;

    /**
     * AI-enhance the prompt text (blocked: kGenMusic not yet in GenTypeHasPromptEnhance)
     */
    static enhancePrompt(prompt: string, expansionenabled: boolean): string;

    /**
     * Returns the active variation index (0-3) from TrackItemChainHistory
     */
    static getActiveVariationIndex(trackitem: object): number;

    /**
     * Returns the channel format of the generated compound clip's audio (e.g. "Stereo")
     */
    static getClipChannelFormat(trackitem: object): string;

    /**
     * Returns mLoop from the master clip's persisted MusicGenerationParams JSON
     */
    static getClipLoopMode(trackitem: object): boolean;

    /**
     * Returns the sample rate in Hz of the generated compound clip's audio
     */
    static getClipSampleRate(trackitem: object): number;

    /**
     * Scans the audio track at starttime for an online compound clip; returns it when generation is complete
     */
    static getGeneratedTrackItem(sequence: object, targettrack: object, starttime: object): any[];

    /**
     * Returns the total variation count from VariationGroupMetadata
     */
    static getVariationCount(trackitem: object): number;

    /**
     * Generate a music prompt suggestion from a local video file path via Firefly |v3|prompts|suggest
     */
    static getVideoPromptSuggestion(videofilepath: string): string;

    /**
     * Re-submit a Generative Music job targeting an existing compound clip
     */
    static regenerateGenMusicJob(sequence: object, existingtrackitem: object, prompt: string, beatsperminute: number, loop: boolean): boolean;

    /**
     * Swap the active variation (0-3) of the compound track item
     */
    static selectVariation(sequence: object, trackitem: object, variationindex: number): boolean;
}

/**
 * Utility to invoke prompt-based Generate Sound Effects
 */
declare class GenSFx {

    /**
     * Creates a GenSFx object
     */
    constructor();

    /**
     * Runs prompt-based Generate Sound Effects directly on the sequence, bypassing the CTB.Returns a status string ('ok' on dispatch); the generated audio lands asynchronously,replacing the offline placeholder that appears over the range.
     */
    static generate(inSequence: Sequence, inPrompt: string, inStartSeconds: number, inDurationSeconds: number): string;
}

/**
 * Runs MultiTrackClusterStrategy directly with configurable parameters.
 */
declare class MultiTrackClustering {

    /**
     * Runs the MultiTrackClusterStrategy and returns an array of TimedFeatureVectorWithIndexVector, one per cluster: timeRange/embedding are the cluster's representative, and indices are the positions (into embeddings/timeRanges) of that cluster's members.
     */
    static cluster(embeddings: Vector[], timeRanges: TimeRange[], similarityThreshold: number): object;
}

/**
 * Panko class provides the ability to leave and read Panko breadcrumb trails in scripting.
 */
declare class Panko {

    /**
     * Get all Panko trail checkpoints logged since the last call, each as { data, callstack }
     */
    static getLog(): any[];

    /**
     * Leave a Panko breadcrumb trail with the given data
     */
    static leaveTrail(data: object): boolean;

    /**
     * Start logging all Panko trail checkpoints hit during the receive period
     */
    static startLog(): boolean;
}

/**
 * Scripting surface for the in-product paywall. Dispatches EVENT_PURCHASE_COMPLETED when a credit purchase completes so an extension can refresh credit-dependent UI.
 */
declare class Paywall {

    /**
     * Dispatched on a Paywall object when a paywall purchase completes, so an extension can refresh credit-dependent UI such as a buy-credits banner.
     */
    static readonly EVENT_PURCHASE_COMPLETED: string;

    static addEventListener(): any;
    static dispatchEvent(): any;

    /**
     * Get a Paywall event target. Call subscribeToEvent(Paywall.EVENT_PURCHASE_COMPLETED), then add a listener for it.
     */
    static getInstance(): Paywall;

    static removeEventListener(): any;

    /**
     * Open the account menu showing the user's generative credit balance. Returns true if the request was dispatched, false if no account menu is available; the result does not confirm the menu opened.
     */
    static showCreditBalance(): boolean;

    /**
     * Propagates the given event on this object.
     */
    subscribeToEvent(eventKey: string): boolean;
}

/**
 * Utility to invoke Speaker Separation
 */
declare class SpeakerSeparation {

    /**
     * Creates a SpeakerSeparation object
     */
    constructor();

    /**
     * Returns the billable duration in seconds Separate() would submit for the track item. Does not submit a job.
     */
    static getBillableDurationSeconds(inTrackItem: TrackItem): number;

    /**
     * Returns a promise that resolves to the estimated credit cost for the given audio duration (seconds). Does not submit a job.
     */
    static getCostEstimate(inAudioDurationSeconds: number): number;

    /**
     * Returns whether Separate Crosstalk would be enabled for the given track-item selection. Does not submit a job.
     */
    static isEnabled(inSelection: object): boolean;

    /**
     * Maps a service|backend dvacore::Result (int) to the user-facing toast result code (int). Does not submit a job.
     */
    static mapToastCode(inResult: number): number;

    /**
     * Runs Speaker Separation directly on the given track item(s), bypassing the confirmation dialog. Returns a promise that resolves once the service job (upload, process, download) completes; stems are imported and placed on the timeline asynchronously afterwards.
     */
    static separate(inTrackItems: any[], inSequence: object): boolean;

    /**
     * Runs the Speaker Separation command on the current timeline audio selection.
     */
    static separateSpeakers(): boolean;

    /**
     * Validates a track item's duration for Speaker Separation; returns the dvacore::Result as an int (0 == success). Does not submit a job.
     */
    static validate(inTrackItem: TrackItem): number;
}

/**
 * Constants for dvamediatypes::TrackIndex
 */
declare class TrackIndex {

    /**
     * Constant meaning the topmost video track.
     */
    static readonly ALWAYS_ON_TOP: number;

    /**
     * Constant meaning unset track index.
     */
    static readonly INVALID: number;
}


/** -------------------------------------------------------------

PARTS OF THIS FILE CONTAIN CODE FROM THE BELOW SOURCE WITH THE FOLLOWING LICENSE:
https://github.com/docsforadobe/Types-for-Adobe

MIT License
Copyright(c) 2018 - Present types -for-adobe contributors
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files(the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and / or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/