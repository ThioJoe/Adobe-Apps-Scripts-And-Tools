/// <reference path="../../shared/global.d.ts" />
// You'll also need the global.d.ts and other shared type definitions from: https://github.com/docsforadobe/Types-for-Adobe
// And you'll need to adjust the path above to correctly reference the location of your global.d.ts file.
//
// Adobe Premiere Pro Types
// Source: https://github.com/ThioJoe/Adobe-Apps-Scripts-And-Tools
//
// NOTE! The types in this file require "dvascripting.EnabledInternalDOM" debug database flag to be enabled.
//
// I have tools for extracting types information at: https://github.com/ThioJoe/Extendscript-XML-Typscript-HTML-Converter
//
// -------------------------------------------------------------------------------------------------------------------------------------

/**
 * Wrapper class to connect to After Effects server.
 */
declare interface AEServer {

	/**
	 * return server connection status.
	 */
	readonly connected: boolean;

	/**
	 * return server name.
	 */
	readonly displayName: string;

	/**
	 * Returns a list of opened projects.
	 */
	readonly projects: any[];

	/**
	 * return server error meesage.
	 */
	readonly statusMessage: string;

	/**
	 * Connect to Server.
	 */
	connect(): boolean;

	/**
	 * Disconnect from Server.
	 */
	disconnect(): boolean;

	/**
	 * Open Project.
	 */
	openProject(filePath: string): object;
}

/**
 * Wrapper class to connect to Media Encoder server.
 */
declare interface AMEServer {

	/**
	 * return server connection status.
	 */
	readonly connected: boolean;

	/**
	 * return server name.
	 */
	readonly displayName: string;

	/**
	 * return server error meesage.
	 */
	readonly statusMessage: string;

	/**
	 * Connect to Server.
	 */
	connect(): boolean;

	/**
	 * Disconnect from Server.
	 */
	disconnect(): boolean;
}

/**
 * AudioAnalysis provides access to common audio analysis functions for audio buffers.
 */
declare class AudioAnalysis {

	/**
	 * Compare two audio buffers and return the maximum absolute difference between their samples. If the buffers differ in size or number of channels, an exception is thrown.
	 */
	static compare(audioBuffer1: AudioBuffer, audioBuffer2: AudioBuffer): number;

	/**
	 * Create an audio buffer from a specified channel of the input audio buffer.
	 */
	static createAudioBufferFromChannel(audioBuffer: AudioBuffer, channelIndex: number): object;

	/**
	 * Create an audio buffer by loading audio data from a specified wavefile.
	 */
	static createAudioBufferFromFile(filepath: string): object;

	/**
	 * Create an audio buffer from a specified range (offset and duration) of the input audio buffer.
	 */
	static createAudioBufferFromRange(audioBuffer: AudioBuffer, offset: number, duration: number): object;

	/**
	 * Get the range of non-silent audio in the audio buffer.
	 */
	static getNonSilentRange(audioBuffer: AudioBuffer): object;

	/**
	 * Check if the audio buffer is silent (all samples are zero).
	 */
	static isSilent(audioBuffer: AudioBuffer): boolean;
}

/**
 * AudioBuffer represents a buffer of multi-channel audio data. It provides methods for manipulating audio samples including copying, mixing, scaling, and zero-detection.
 */
declare interface AudioBuffer {

	/**
	 * Get the current buffer size in samples.
	 */
	getBufferSize(): number;

	/**
	 * Get the number of channels in this audio buffer.
	 */
	getChannelCount(): number;
}

/**
 * AudioBusDescription represents a named audio channel layout.
 */
declare class AudioBusDescription {

	/**
	 * Auxiliary bus
	 */
	static readonly TYPE_AUXILIARY: number;

	/**
	 * Main bus
	 */
	static readonly TYPE_MAIN: number;

	/**
	 * The channel layout of this bus.
	 */
	layout: object;

	/**
	 * The name of this bus.
	 */
	name: string;

	/**
	 * The type of this bus.
	 */
	type: number;

	/**
	 * Construct an AudioBusDescription object
	 */
	constructor();
}

/**
 * AudioChannelMap represents a channel map.
 */
declare class AudioChannelMap {

	/**
	 * No match
	 */
	static readonly SOURCECHANNELINDEX_NOMATCH: number;

	/**
	 * Out of range
	 */
	static readonly SOURCECHANNELINDEX_OUTOFRANGE: number;

	/**
	 * Return the number of mapped channels.
	 */
	readonly channelCount: number;

	/**
	 * Construct an AudioChannelMap object.
	 */
	constructor(channelMap: AudioChannelMap);

	/**
	 * Return the mapping of the channel at <index>.
	 */
	getMapping(index: number): number;

	/**
	 * Set the mapping of the channel at <index>.
	 */
	setMapping(index: number, mapping: number): boolean;
}

/**
 * Represents the current audio device object. Data like 'sample rate' is editable.
 */
declare class AudioDevice {

	/**
	 * Returns audio device settings
	 */
	static readonly audioDeviceSettings: any;

	/**
	 * An array of I/O blocksizes the device supports
	 */
	readonly availableIOBlockSizes: number[];

	/**
	 * An array of available sample rates
	 */
	readonly availableSampleRates: number[];

	/**
	 * Get the AudioDeviceObject of the currently active audio device
	 */
	static readonly currentAudioDevice: AudioDevice;

	/**
	 * The number of dropouts since the start of the device.
	 */
	readonly dropoutCountSinceStart: number;

	/**
	 * Names of input channels
	 */
	readonly inputChannelNames: string[];

	/**
	 * The class identifier of the input device
	 */
	readonly inputDeviceClassID: number;

	/**
	 * The class name of the input device
	 */
	readonly inputDeviceClassName: string;

	/**
	 * The info object of the input device
	 */
	readonly inputDeviceInfo: AudioDeviceInfo;

	/**
	 * The name of the input device
	 */
	readonly inputDeviceName: string;

	/**
	 * The input latency of the device
	 */
	readonly inputLatency: number;

	/**
	 * The input ports of the device
	 */
	readonly inputPorts: any[];

	/**
	 * The I/O blocksize in sample frames of the device
	 */
	ioBlockSize: number;

	/**
	 * True, if the device is still alive, and not disconnected or disabled
	 */
	readonly isAlive: boolean;

	/**
	 * True, if the device and therefore also its subdevices are running (i.e. playing back)
	 */
	readonly isDeviceRunning: boolean;

	/**
	 * True, if any of the device streams is resampling
	 */
	readonly isResampling: boolean;

	/**
	 * An array of floats containing the current maximum audio level per channel. The value is reset after the call. The array length is 0, if no data is streamed.You need to throttle the frequency in which you read the property (i.e. query 30fps).
	 */
	readonly meterInfoInput: number[];

	/**
	 * An array of floats containing the current maximum audio level per channel. The value is reset after the call. The array length is 0, if no data is streamed. You need to throttle the frequency in which you read the property (i.e. query 30fps).
	 */
	readonly meterInfoOutput: number[];

	/**
	 * If enabled, the device channel mapping is used, i.e. the first channel contains the mapped channel, thus not refers to the physical channel index.
	 */
	meterInfoUseChannelMapping: boolean;

	/**
	 * If a device doesn't have any input channels, the return value is zero.
	 */
	readonly numberOfInputChannels: number;

	/**
	 * If a device doesn't have any output channels, the return value is zero.
	 */
	readonly numberOfOutputChannels: number;

	/**
	 * Names of output channels
	 */
	readonly outputChannelNames: string[];

	/**
	 * The class identifier of the output device
	 */
	readonly outputDeviceClassID: number;

	/**
	 * The class name of the output device
	 */
	readonly outputDeviceClassName: string;

	/**
	 * The info object of the output device
	 */
	readonly outputDeviceInfo: AudioDeviceInfo;

	/**
	 * The name of the output device
	 */
	readonly outputDeviceName: string;

	/**
	 * The output latency of the device
	 */
	readonly outputLatency: number;

	/**
	 * The output ports of the device
	 */
	readonly outputPorts: any[];

	/**
	 * The sample rate of the device
	 */
	sampleRate: number;

	/**
	 * True if the sample rates for the output and input device match
	 */
	readonly sampleRatesMatch: boolean;

	/**
	 * Returns a property list containing avg, min, max and stdev of current device load. (Normalized values 0...1).
	 */
	getDeviceLoadStatistics(): PropertyList;

	/**
	 * Returns an info object for the given device property ID
	 */
	propertyInfo(property: number): AudioDevicePropertyInfo;

	/**
	 * Reset input and output channel mapping of the device to the default values.
	 */
	resetChannelMaps(): boolean;

	/**
	 * Resets the number of dropouts since the start of the device.
	 */
	resetDropoutCountSinceStart(): boolean;

	/**
	 * Restarts the audio device.
	 */
	restart(): boolean;

	/**
	 * Set the currently active audio device
	 */
	static setCurrentAudioDevice(inputDevice: AudioDeviceInfo, outputDevice: AudioDeviceInfo, inputDeviceIsPrimaryDevice: boolean): boolean;
}

/**
 * Holds information about audio device class
 */
declare class AudioDeviceClass {

	/**
	 * Get a vector of AudioDeviceClassObjects
	 */
	static readonly audioDeviceClasses: any[];

	/**
	 * Returns the class identifier
	 */
	readonly classID: number;

	/**
	 * Returns the class name
	 */
	readonly className: string;

	/**
	 * Returns a vector of AudioDeviceInfoExtendScriptObjects refering to input devices
	 */
	readonly inputDevices: any[];

	/**
	 * Returns a vector of AudioDeviceInfoExtendScriptObjects refering to output devices
	 */
	readonly outputDevices: any[];

	/**
	 * Get an AudioDeviceClassObject by its class name.
	 */
	static audioDeviceClassByName(className: string): AudioDeviceClass;

	/**
	 * Returns an info object for the given device property ID.
	 */
	propertyInfo(property: number): AudioDevicePropertyInfo;
}

/**
 * Holds information about audio device depending on class ID and device UID
 */
declare interface AudioDeviceInfo {

	/**
	 * An array of I/O blocksizes the device supports
	 */
	readonly availableIOBlockSizes: number[];

	/**
	 * An array of available sample rates
	 */
	readonly availableSampleRates: number[];

	/**
	 * The name of the device
	 */
	readonly name: string;

	/**
	 * If a device doesn't have any input channels, the return value is zero.
	 */
	readonly numberOfInputChannels: number;

	/**
	 * If a device doesn't have any output channels, the return value is zero.
	 */
	readonly numberOfOutputChannels: number;

	/**
	 * The UID of the device
	 */
	readonly uid: string;
}

/**
 * Holds information about an audio device port
 */
declare interface AudioDevicePort {

	/**
	 * The ID of the device port
	 */
	readonly id: number;

	/**
	 * The name of the device port
	 */
	readonly name: string;

	/**
	 * The number of Channels associated with this port
	 */
	readonly numberOfChannels: number;
}

/**
 * Provides information for a given device property ID.A device property specifies whether it is a shared, available or mutable attribute.It also specifies what kind of value is available (current value/value list, default value, min/max value.
 */
declare interface AudioDevicePropertyInfo {

	/**
	 * Returns true whether the device property is a supported attribute
	 */
	readonly available: boolean;

	/**
	 * Returns the default value for this device property if available
	 */
	readonly defaultValue: string;

	/**
	 * Returns the device property ID
	 */
	readonly devicePropertyID: number;

	/**
	 * Returns true whether a default value for this device property is available
	 */
	readonly hasDefaultValue: boolean;

	/**
	 * Returns true whether min and max values for this device property are available
	 */
	readonly hasMinMaxValues: boolean;

	/**
	 * Returns true whether a value for this device property is available
	 */
	readonly hasValue: boolean;

	/**
	 * Returns true whether a value list for this device property is available
	 */
	readonly hasValueList: boolean;

	/**
	 * Returns the min and max value for this device property if available
	 */
	readonly minMaxValues: string[];

	/**
	 * Returns true whether the device property is an editable attribute
	 */
	readonly mutable: boolean;

	/**
	 * Returns true whether the device property is a shared attribute
	 */
	readonly shared: boolean;

	/**
	 * Returns the value for this device property if available
	 */
	readonly value: string;

	/**
	 * Returns the value list for this device property if available
	 */
	readonly valueList: string[];
}

/**
 * AudioFilter
 */
declare interface AudioFilter {

	/**
	 * The ID of the audio filter.
	 */
	readonly ID: string;

	/**
	 * The display name of this audio filter.
	 */
	readonly displayName: string;

	/**
	 * The input buses of the audio filter.
	 */
	readonly inputBuses: any[];

	/**
	 * The output buses of the audio filter.
	 */
	readonly outputBuses: any[];

	/**
	 * Return the number of parameters.
	 */
	readonly parameterCount: number;

	/**
	 * Assignes a channel mapping.
	 */
	assignChannelMapping(isInput: boolean, filterChannel: number, targetChannel: number): boolean;

	/**
	 * Returns the channel index for a target bus channel.
	 */
	getFilterChannelForTarget(isInput: boolean, targetChannel: number): number;

	/**
	 * Return the value of the parameter at <index>.
	 */
	getParameter(index: number): number;

	/**
	 * Removes the channel mapping for a filter channel.
	 */
	removeChannelMapping(isInput: boolean, filterChannel: number): boolean;

	/**
	 * Requests the input/output bus configuration from the audio filter.
	 */
	requestBusConfiguration(inputs: any[], outputs: any[]): boolean;

	/**
	 * Set the value of the parameter at <index>.
	 */
	setParameter(index: number, value: number): boolean;
}

/**
 * AudioFormat describes the format in the form of the sample rate, the bit depth and the channel layout.
 */
declare class AudioFormat {

	/**
	 * 16 bit signed integer
	 */
	static readonly SAMPLETYPE_16: number;

	/**
	 * 24 bit signed integer
	 */
	static readonly SAMPLETYPE_24: number;

	/**
	 * 32 bit floating point
	 */
	static readonly SAMPLETYPE_32: number;

	/**
	 * 8 bit unsigned integer
	 */
	static readonly SAMPLETYPE_8: number;

	/**
	 * Bit depth of a sample as well as its data format. Always normalized to 8 bit unsigned integer, 16 bit signed integer little endian, 24 bit signed integer little endian, packed or 32 bit floating point (range -1.0 to 1.0)
	 */
	bitDepth: number;

	/**
	 * Channel layout
	 */
	channelLayout: object;

	/**
	 * Samplerate
	 */
	sampleRate: number;

	/**
	 * Constructs a new AudioFormat object.
	 */
	constructor(samplerate: number, bitDepth: number, channelLayout: AudioChannelLayout);
}

/**
 * Audio render options for rendering audio.
 */
declare class AudioRenderOptions {

	/**
	 * Audio render options number of audio chanels.
	 */
	numAudioChannels: number;

	/**
	 * Audio render options sample rate.
	 */
	sampleRate: number;

	/**
	 * Construct audio render options.
	 */
	static createAudioRenderOptions(numAudioChannels: number, sampleRate: number): AudioRenderOptions;
}

/**
 * Dynamiclink connect to audio renderer callback.
 */
declare interface AudioRendererConnectionEvent {

	/**
	 * Return connection event message.
	 */
	readonly message: string;

	/**
	 * Return connection event status.
	 */
	readonly succeeded: boolean;
}

/**
 * Wrapper class to connect to Character Animator server.
 */
declare interface ChServer {

	/**
	 * return server connection status.
	 */
	readonly connected: boolean;

	/**
	 * return server name.
	 */
	readonly displayName: string;

	/**
	 * Returns a list of opened projects.
	 */
	readonly projects: any[];

	/**
	 * return server error meesage.
	 */
	readonly statusMessage: string;

	/**
	 * Connect to Server.
	 */
	connect(): boolean;

	/**
	 * Disconnect from Server.
	 */
	disconnect(): boolean;

	/**
	 * Open Project.
	 */
	openProject(filePath: string): object;
}

/**
 * An object represent the dvacore::debug::CodeProfiler mechanism on ExtendScript.
 */
declare class CodeProfiler {

	/**
	 * Construct a CodeProfiler object
	 */
	constructor();

	/**
	 * Generate profile dump text
	 */
	static generateProfileDumpText(filterString: string): string;

	/**
	 * Get profile data for a specific id.
	 */
	get(id: string): CodeProfilerLog;

	/**
	 * Reset all profiled data.
	 */
	reset(): boolean;

	/**
	 * Set profiling volume.
	 */
	setVolume(volume: number): boolean;

	/**
	 * Start profiling.
	 */
	start(): boolean;

	/**
	 * Stop profiling.
	 */
	stop(): boolean;
}

/**
 * A live object belonging to a specific profiling id. This kind of object can be created before any values for the respective id are logged to dva code profiler. Up-to-date log measurements can be retreived by calling one of its' methods like 'averageTime'. As long as no values are logged to dva code profiler these methods return 0.
 */
declare interface CodeProfilerLog {

	/**
	 * Get the average time over all logs. Returns 0, if no value for the corresponding id is logged to dva code profiler, yet.
	 */
	readonly averageTime: number;

	/**
	 * Get the id of this data object belongs to.
	 */
	readonly id: string;

	/**
	 * Get the longest time over all logs. Returns 0, if no value for the corresponding id is logged to dva code profiler, yet.
	 */
	readonly longestTime: number;

	/**
	 * Get the number of logs. Returns 0, if no value for the corresponding id is logged to dva code profiler, yet.
	 */
	readonly numLogs: number;

	/**
	 * Get the shortest time over all logs. Returns 0, if no value for the corresponding id is logged to dva code profiler, yet.
	 */
	readonly shortestTime: number;

	/**
	 * Get the total time over all logs. Returns 0, if no value for the corresponding id is logged to dva code profiler, yet.
	 */
	readonly totalTime: number;

	/**
	 * Reset profiled data.
	 */
	reset(): boolean;
}

/**
 * Command handling
 */
declare class Command {

	/**
	 * Invokes a particular application command by its identifier string. These are similar to the commands shown in the Keyboard Shortcuts dialog. Returns true on success.
	 */
	static invokeCommand(command: string): boolean;

	/**
	 * Invokes a particular command ID. Returns true on success.
	 */
	static invokeCommandByID(commandID: number): boolean;

	/**
	 * Returns true if the current application command is checked.
	 */
	static isCommandChecked(command: string): boolean;

	/**
	 * Returns true if the current application command is enabled and can be called in the current state.
	 */
	static isCommandEnabled(command: string): boolean;

	/**
	 * Returns true if the current command ID is checked.
	 */
	static isCommandIDChecked(commandID: number): boolean;

	/**
	 * Returns true if the current command ID is enabled and can be called in the current state.
	 */
	static isCommandIDEnabled(commandID: number): boolean;
}


/**
 * Command event object
 */
/** @ts-expect-error */
declare class CommandEvent {

	/**
	 * A command is about to be invoked
	 */
	static readonly EVENT_INVOKE_COMMAND: string;

	/**
	 * Description of the command.
	 */
	readonly description: string;

	/**
	 * Command ID.
	 */
	readonly id: number;

	/**
	 * Name of the command.
	 */
	readonly name: string;

	/**
	 * Title of the command.
	 */
	readonly title: string;
}

/**
 * Interface to log additional data to potential crash reports
 */
declare class CrashReporter {

	/**
	 * Add Key/Value Data to the Crash Reporter. Returns true on success. lower-case period-separated keys are preferred for some crash reporters. For example key='session.id'
	 */
	static addData(key: string, value: string): boolean;

	/**
	 * Add the test name and/or the test case from Automation. Returns true on success. A test case is the smallest unit of automated tests, e.g. 'nudging clips when no clips are selected'. A test is a collection of test cases that cover the same functionality but different scenarios, e.g. 'nudging clips'
	 */
	static logTestCase(testName: string, testCase: string): boolean;
}

/**
 * DropoutReason provides access to constants referring to the different types of dropouts.
 */
declare class DropoutReason {

	/**
	 * The audio I/O thread needs to read prefetched audio data from the cache but the audio data is not found in the cache.
	 */
	static readonly AUDIO_NOT_IN_CACHE: number;

	/**
	 * Too much jitter on the audio clock.
	 */
	static readonly CLOCK_JITTER: number;

	/**
	 * The audio I/O ran into a buffer underrun situation.
	 */
	static readonly IO_BUFFER_UNDERRUN: number;

	/**
	 * The audio I/O thread exceeded its time limit, taking more time than available in the I/O cycle.
	 */
	static readonly IO_TIME_LIMIT_EXCEEDED: number;

	/**
	 * Some prefetch requests have not been dispatched as we did not have enough capacity to accumulate all prefetch requests needed to render the audio processing chain.
	 */
	static readonly PREFETCH_REQUESTS_NOT_DISPATCHED: number;

	/**
	 * Requested audio data is not prefetched within the time limit.
	 */
	static readonly PREFETCH_TIME_LIMIT_EXCEEDED: number;
}

/**
 * Dropout reporters can be used to track the number of dropouts that occur during their lifetime.
 */
declare class DropoutReporter {

	/**
	 * Create a new instance.
	 */
	constructor();

	/**
	 * Get the number of dropouts for a specified dropout reason. Use the constants provided by DropoutReason as argument.
	 */
	getDropoutCount(uArg1: number): number;

	/**
	 * Get the number of total dropouts.
	 */
	getTotalDropoutCount(): number;

	/**
	 * Reset the dropout reporter.
	 */
	reset(): boolean;
}

/**
 * Wrapper class to connect to Media Encoder server.
 */
declare class DynamicLink {

	/**
	 * Constant
	 */
	static readonly AEServer: string;

	/**
	 * Constant
	 */
	static readonly AMEServer: string;

	/**
	 * Constant
	 */
	static readonly ChServer: string;

	/**
	 * Constant
	 */
	static readonly PProServer: string;

	/**
	 * return registered After Effects dynamiclink server path. DynamiclinkManager would be looking for After Effects dynamiclink server at this location.
	 */
	static readonly aeServerPath: string;

	/**
	 * return registered Media Encoder dynamiclink server path. DynamiclinkManager would be looking for Media Encoder dynamiclink server at this location.
	 */
	static readonly ameServerPath: string;

	/**
	 * return registered Character Animator dynamiclink server path. DynamiclinkManager would be looking for Charactor Animator dynamiclink server at this location.
	 */
	static readonly chServerPath: string;

	/**
	 * return dynamiclink related info, such as supported server, api version.
	 */
	static readonly info: any;

	/**
	 * return registered Premiere Pro dynamiclink server path. DynamiclinkManager would be looking for Premiere Pro dynamiclink server at this location.
	 */
	static readonly pproServerPath: string;

	/**
	 * return dynamiclink server protocol version.
	 */
	static readonly serverAppVersion: string;

	/**
	 * Create connection.
	 */
	static createConnection(name: string): object;
}

/**
 * Wrapper class for dynamiclink audio renderer.
 */
declare interface DynamiclinkAudioRenderer {

	/**
	 * Render a chunk of audio.
	 */
	renderAudio(): object;
}

/**
 * Wrapper class for a binary reference.
 */
declare interface DynamiclinkBinaryReference {
}

/**
 * Wrapper class for dynamiclink project.
 */
declare interface DynamiclinkProject {

	/**
	 * return server connection status.
	 */
	readonly connected: boolean;

	/**
	 * return file path of the project object.
	 */
	readonly filepath: string;

	/**
	 * Returns a list of project items.
	 */
	readonly items: any[];

	/**
	 * return name of the project object.
	 */
	readonly name: string;

	/**
	 * Returns a list of opened sources.
	 */
	readonly openedSources: any[];

	/**
	 * return server error message.
	 */
	readonly statusMessage: string;

	/**
	 * Get project items.
	 */
	getProjectItems(): boolean;

	/**
	 * Open source.
	 */
	openSource(sourceId: string): object;
}

/**
 * Wrapper class for dynamiclink project item info.
 */
declare interface DynamiclinkProjectItemInfo {

	/**
	 * return the id of the project item info object.
	 */
	readonly id: string;

	/**
	 * return name of the project item info object.
	 */
	readonly name: string;

	/**
	 * return project item info type.
	 */
	readonly type: string;
}

/**
 * Wrapper class for dynamiclink source.
 */
declare interface DynamiclinkSource {

	/**
	 * return server connection status.
	 */
	readonly connected: boolean;

	/**
	 * return duration of the source.
	 */
	readonly duration: object;

	/**
	 * return frame rate of the source.
	 */
	readonly frameRate: object;

	/**
	 * return height of the source.
	 */
	readonly height: number;

	/**
	 * return name of the source object.
	 */
	readonly name: string;

	/**
	 * return number of audio channels in the source.
	 */
	readonly numAudioChannels: number;

	/**
	 * return pixel aspect ratio of the source.
	 */
	readonly pixelAspectRatio: object;

	/**
	 * return server error message.
	 */
	readonly statusMessage: string;

	/**
	 * return width of the source.
	 */
	readonly width: number;

	/**
	 * Get the source audio renderer.
	 */
	getAudioRenderer(audioRenderOptions: object, startTime: object, numSamplesPerBuffer: number): object;

	/**
	 * Get the source video renderer.
	 */
	getVideoRenderer(videoRenderOptions: object): object;
}

/**
 * Wrapper class for dynamiclink video renderer.
 */
declare interface DynamiclinkVideoRenderer {

	/**
	 * Render a video frame.
	 */
	renderVideo(time: object): object;
}

/**
 * Represents an EssentialSound Mix Type mode and its contained sections.
 */
declare class EssentialSound {

	/**
	 * Ambience essential sound Type
	 */
	static readonly CLIP_TYPE_AMBIENCE: number;

	/**
	 * Background Music essential sound Type
	 */
	static readonly CLIP_TYPE_BACKGROUND_MUSIC: number;

	/**
	 * Dialog Essential Sound Type
	 */
	static readonly CLIP_TYPE_DIALOG: number;

	/**
	 * Empty Clip Type
	 */
	static readonly CLIP_TYPE_EMPTY: number;

	/**
	 * Generic essential sound Type
	 */
	static readonly CLIP_TYPE_GENERIC: number;

	/**
	 * Music essential sound Type
	 */
	static readonly CLIP_TYPE_MUSIC: number;

	/**
	 * Other essential sound Type
	 */
	static readonly CLIP_TYPE_OTHER: number;

	/**
	 * No Essential Sound Tag assigned type
	 */
	static readonly MIX_TYPE_NOT_SET: string;

	/**
	 * Gets the progress category ID shared by Essential Sound operations such as auto-ducking. Pass it to ProgressCategoryContainer.getOrCreateProgressCategory(inCategoryID).
	 */
	static readonly PROGRESS_CATEGORY_ID: string;

	/**
	 * Retrieve all currently available Mix Types.
	 */
	static readonly availableMixTypes: string[];

	/**
	 * Retrieve all Essential Sound Template GUIDs in an array objects containing Mix Type, Guid and Name of the configuration.
	 */
	readonly availableTemplateGuids: any[];

	/**
	 * Retrieve all UserPresets of the current MixType. Each entry contains a pair of the preset name and the corresponding preset GUID
	 */
	readonly availableUserPresets: any[];

	/**
	 * Specifies the Mix Type of the selected clips which in turn defines the underlying section models.
	 */
	mixType: string;

	/**
	 * The UserPreset GUID on the model. Writing a new preset Guid will effectively apply the preset to the current selection. Setting the preset will fail if an invalid GUID is supplied. If the selection contains different presets, an empty GUID will be returned.
	 */
	userPresetGuid: string;

	/**
	 * Construct a new EssentialSound object
	 */
	constructor(audioClips: any[]);

	/**
	 * Get Track Items of given Essential Sound Type
	 */
	getClipsOfType(clipType: number): any[];

	/**
	 * Get the currently selected Essential Sound Template GUID for the specified Mix Type
	 */
	getCurrentTemplateGuid(mixType: string): string;

	/**
	 * Returned object can be used to modify model parameters
	 */
	getSection(sectionID: string): object;

	/**
	 * Change the observed clips on the document
	 */
	setClips(audioClips: any[]): boolean;

	/**
	 * Set the active Essential Sound Template GUID for the specified Mix Type
	 */
	setTemplate(mixType: string, templateGuid: string): boolean;
}

/**
 * An object for manipulating a group of parameters for EssentialSound, (e.g. Loudness).
 */
declare class EssentialSoundSection {

	/**
	 * The clarity model
	 */
	static readonly CLARITY: string;

	/**
	 * Controls Amount of Dynamics
	 */
	static readonly CLARITY_DYNAMICS: number;

	/**
	 * Get current Analysis Status
	 */
	static readonly CLARITY_DYNAMICS_ANALYSIS_STATUS: number;

	/**
	 * Reanalyze the clip's dynamics features
	 */
	static readonly CLARITY_DYNAMICS_RESET_ANALYSIS: number;

	/**
	 * Enables the Clarity Section
	 */
	static readonly CLARITY_ENABLED: number;

	/**
	 * Enables Dynamics Control
	 */
	static readonly CLARITY_ENABLE_DYNAMICS: number;

	/**
	 * Enables 10 Band Equalizer
	 */
	static readonly CLARITY_ENABLE_EQ: number;

	/**
	 * Enables Vocal Enhancer
	 */
	static readonly CLARITY_ENABLE_VOCALENHANCE: number;

	/**
	 * Controls Amount of 10 Band Equalizer
	 */
	static readonly CLARITY_EQ: number;

	/**
	 * Read Value of 1st EQ Band
	 */
	static readonly CLARITY_EQCURVE_0: number;

	/**
	 * Read Value of 2nd EQ Band
	 */
	static readonly CLARITY_EQCURVE_1: number;

	/**
	 * Read Value of 3rd EQ Band
	 */
	static readonly CLARITY_EQCURVE_2: number;

	/**
	 * Read Value of 4th EQ Band
	 */
	static readonly CLARITY_EQCURVE_3: number;

	/**
	 * Read Value of 5th EQ Band
	 */
	static readonly CLARITY_EQCURVE_4: number;

	/**
	 * Read Value of 6th EQ Band
	 */
	static readonly CLARITY_EQCURVE_5: number;

	/**
	 * Read Value of 7th EQ Band
	 */
	static readonly CLARITY_EQCURVE_6: number;

	/**
	 * Read Value of 8th EQ Band
	 */
	static readonly CLARITY_EQCURVE_7: number;

	/**
	 * Read Value of 9th EQ Band
	 */
	static readonly CLARITY_EQCURVE_8: number;

	/**
	 * Read Value of 10th EQ Band
	 */
	static readonly CLARITY_EQCURVE_9: number;

	/**
	 * Changes EQ Parameter Preset
	 */
	static readonly CLARITY_EQ_PRESET: number;

	/**
	 * Controls Vocal Enhancer Mode
	 */
	static readonly CLARITY_VOCALENHANCE: number;

	/**
	 * The ducking model
	 */
	static readonly DUCKING: string;

	/**
	 * Automatically track clip changes
	 */
	static readonly DUCKING_AUTO_TRACK: number;

	/**
	 * 1.0 if Autotrack is supported
	 */
	static readonly DUCKING_AUTO_TRACK_SUPPORTED: number;

	/**
	 * Enables the Ducking Section
	 */
	static readonly DUCKING_ENABLED: number;

	/**
	 * Enable Ducking Control
	 */
	static readonly DUCKING_ENABLE_DUCKING: number;

	/**
	 * Position of fades relative to target
	 */
	static readonly DUCKING_FADES_POSITION: number;

	/**
	 * Fade Timing and Length
	 */
	static readonly DUCKING_FADE_DURATION: number;

	/**
	 * 1.0 if the clip has ducking keyframes
	 */
	static readonly DUCKING_HAS_KEYFRAMES: number;

	/**
	 * Join adjacent music clips into one bed
	 */
	static readonly DUCKING_JOIN_MUSIC_BED: number;

	/**
	 * Handle to the generated keyframes
	 */
	static readonly DUCKING_KEYFRAMES: number;

	/**
	 * Get current Keyframe Status
	 */
	static readonly DUCKING_KEYFRAME_STATUS: number;

	/**
	 * Number of clips in this clip's music bed
	 */
	static readonly DUCKING_MUSIC_BED_MEMBER_COUNT: number;

	/**
	 * Music bed role: 0=solo, 1=head, 2=member
	 */
	static readonly DUCKING_MUSIC_BED_ROLE: number;

	/**
	 * Recompute Ducking Keyframes
	 */
	static readonly DUCKING_RECOMPUTE: number;

	/**
	 * Ducking Attenuation
	 */
	static readonly DUCKING_REDUCE_BY: number;

	/**
	 * Threshold to start Ducking
	 */
	static readonly DUCKING_SENSITIVITY: number;

	/**
	 * Sets the Target Types against to Duck
	 */
	static readonly DUCKING_TARGET_TYPES: number;

	/**
	 * The duration model
	 */
	static readonly DURATION: string;

	/**
	 * Enables the Duration Section
	 */
	static readonly DURATION_ENABLED: number;

	/**
	 * Enable Remix Controls
	 */
	static readonly DURATION_ENABLE_REMIX: number;

	/**
	 * Maximum Duration in Seconds
	 */
	static readonly DURATION_MAX_DURATION: number;

	/**
	 * Minimum Duration in Seconds
	 */
	static readonly DURATION_MIN_DURATION: number;

	/**
	 * Changes the Mode (Remix/Stretch)
	 */
	static readonly DURATION_MODE: number;

	/**
	 * Operation Status
	 */
	static readonly DURATION_OPERATION_STATUS: number;

	/**
	 * Favors shorter Segments during Remix
	 */
	static readonly DURATION_REMIX_FAVOR_SHORT_SEGMENTS: number;

	/**
	 * Features weight for Remix (Timbre vs. Harmonics)
	 */
	static readonly DURATION_REMIX_FEATURES_WEIGHT: number;

	/**
	 * Number of Segments of a remix (less vs. more)
	 */
	static readonly DURATION_REMIX_SEGMENTS_WEIGHT: number;

	/**
	 * Samplerate of Clip (for TC Control)
	 */
	static readonly DURATION_SAMPLERATE: number;

	/**
	 * Sets the Target Duration Numerator
	 */
	static readonly DURATION_TARGET: number;

	/**
	 * Duration Denominator - forfeit if 0
	 */
	static readonly DURATION_TARGET_DENOMINATOR: number;

	/**
	 * The loudness model
	 */
	static readonly LOUDNESS: string;

	/**
	 * Get Adjusted Loudness from Model
	 */
	static readonly LOUDNESS_ADJUSTED: number;

	/**
	 * Get current Analysis Status
	 */
	static readonly LOUDNESS_ANALYSIS_STATUS: number;

	/**
	 * Turns on Auto Loudness
	 */
	static readonly LOUDNESS_AUTO_MATCH: number;

	/**
	 * True if auto loudness param is set
	 */
	static readonly LOUDNESS_AUTO_SET: number;

	/**
	 * Enables the Loudness Section
	 */
	static readonly LOUDNESS_ENABLED: number;

	/**
	 * Get Measured Loudness from Model
	 */
	static readonly LOUDNESS_MEASURED: number;

	/**
	 * Reset Persisted Measurements
	 */
	static readonly LOUDNESS_RESET_ANALYSIS: number;

	/**
	 * Enables Volume Rider (dynamic keyframes)
	 */
	static readonly LOUDNESS_VOLUME_RIDER: number;

	/**
	 * Get current Volume Rider analysis status
	 */
	static readonly LOUDNESS_VOLUME_RIDER_STATUS: number;

	/**
	 * The pan model
	 */
	static readonly PAN: string;

	/**
	 * Controls Pan Amount
	 */
	static readonly PAN_AMOUNT: number;

	/**
	 * Enables the Pan Section
	 */
	static readonly PAN_ENABLED: number;

	/**
	 * Indicates if Pan is supported
	 */
	static readonly PAN_PAN_NOT_SUPPORTED: number;

	/**
	 * The restoration model
	 */
	static readonly RESTORATION: string;

	/**
	 * Enables the restoration section
	 */
	static readonly RESTORATION_ENABLED: number;

	/**
	 * Enables the Hum Reduction Section
	 */
	static readonly RESTORATION_ENABLE_REDUCE_HUM: number;

	/**
	 * Enables Noise Reduction Control
	 */
	static readonly RESTORATION_ENABLE_REDUCE_NOISE: number;

	/**
	 * Enables Reverb Reduction Control
	 */
	static readonly RESTORATION_ENABLE_REDUCE_REVERB: number;

	/**
	 * Enabled Rumble Reduction
	 */
	static readonly RESTORATION_ENABLE_REDUCE_RUMBLE: number;

	/**
	 * Enables Sibilance Reduction
	 */
	static readonly RESTORATION_ENABLE_REDUCE_SIBILANCE: number;

	/**
	 * Sets the Hum Reduction Frequency
	 */
	static readonly RESTORATION_HUM_FREQUENCY: number;

	/**
	 * Controls Amount of Hum Reduction
	 */
	static readonly RESTORATION_REDUCE_HUM: number;

	/**
	 * Controls Amount of Noise Reduction
	 */
	static readonly RESTORATION_REDUCE_NOISE: number;

	/**
	 * Controls Amount of Reverb Reduction
	 */
	static readonly RESTORATION_REDUCE_REVERB: number;

	/**
	 * Controls Amount of Rumble Reduction
	 */
	static readonly RESTORATION_REDUCE_RUMBLE: number;

	/**
	 * Controls Amount of Sibilance Reduction
	 */
	static readonly RESTORATION_REDUCE_SIBILANCE: number;

	/**
	 * The sound effects model
	 */
	static readonly SOUND_EFFECTS: string;

	/**
	 * Enables the Sound Effects Section
	 */
	static readonly SOUND_EFFECTS_ENABLED: number;

	/**
	 * Enables Reverb Control
	 */
	static readonly SOUND_EFFECTS_ENABLE_REVERB: number;

	/**
	 * Controls Amount of Reverb
	 */
	static readonly SOUND_EFFECTS_REVERB: number;

	/**
	 * The Current Reverb Preset
	 */
	static readonly SOUND_EFFECTS_REVERB_PRESET: number;

	/**
	 * The stereo width model
	 */
	static readonly STEREO_WIDTH: string;

	/**
	 * Controls Amount of Stereo Width
	 */
	static readonly STEREO_WIDTH_AMOUNT: number;

	/**
	 * Enables the Stereo Width Section
	 */
	static readonly STEREO_WIDTH_ENABLED: number;

	/**
	 * Enables Stereo Width Control
	 */
	static readonly STEREO_WIDTH_ENABLE_STEREO_WIDTH: number;

	/**
	 * The volume model
	 */
	static readonly VOLUME: string;

	/**
	 * Controls Volume Amount
	 */
	static readonly VOLUME_AMOUNT: number;

	/**
	 * Enables the Volume Section
	 */
	static readonly VOLUME_ENABLED: number;

	/**
	 * Enables Volume Control
	 */
	static readonly VOLUME_ENABLE_VOLUME: number;

	/**
	 * Mutes this Clip
	 */
	static readonly VOLUME_MUTE: number;

	/**
	 * Returns the number of parameters used by this model
	 */
	getNumParams(): number;

	/**
	 * Returns the internal name of a given parameter ID
	 */
	getParamName(parameterID: number): string;

	/**
	 * Returns the normalized value for a given parameter ID
	 */
	getParamNormalized(parameterID: number): number;

	/**
	 * Sets the normalized value for the given parameter ID
	 */
	setParamNormalized(parameterID: number, value: number): boolean;

	/**
	 * Converts a physical value for a parameter into a normalized value
	 */
	toNormalized(parameterID: number, value: number): number;

	/**
	 * Convert a normalized value for a parameter into a physical value
	 */
	toPhysical(parameterID: number, value: number): number;
}

/**
 * Event object
 */
declare interface Event {

	/**
	 * Event data.
	 */
	readonly data: object;
}

/**
 * A collection of utility functions related to file handling.
 */
declare class FileUtils {

	/**
	 * Opens a new explorer/finder window on Windows/macOS - opens the folder where 'filePaths' reside and then selects the files
	 */
	static revealAndSelectFiles(filePaths: string[]): boolean;
}

/**
 * Provide information about available devices
 */
declare class GPUFoundation {

	/**
	 * Return number of available devices
	 */
	static readonly getDeviceCount: number;

	/**
	 * Construct a GPUFoundation script object
	 */
	constructor();

	/**
	 * Return Hardware Family
	 */
	static getHardwareFamily(index: number): number;
}

/**
 * An object represent the dvacore::debug::GlobalTimeMeasurement
 */
declare class GlobalTimeMeasurement {

	/**
	 * Begin measurement with logging
	 */
	static beginMeasurementWithLogging(tokenString: string, consoleString: string): boolean;

	/**
	 * End measurement with logging
	 */
	static endMeasurementWithLogging(tokenString: string, consoleString: string): boolean;

	/**
	 * Make intermediate measurement with logging
	 */
	static intermediateMeasurementWithLogging(tokenString: string, consoleString: string): boolean;

	/**
	 * Pop one entry off a the last set of aggregated time measurements for a group
	 */
	static readAggregatedMeasurement(groupString: string): GlobalTimeMeasurementAggregatedStatistics;

	/**
	 * Reads one global time measurement entry. time == 0., if no item could be read.
	 */
	static readMeasurement(): GlobalTimeMeasurementLog;
}

/**
 * The aggregated statistics for a set of time measurements.
 */
declare interface GlobalTimeMeasurementAggregatedStatistics {

	/**
	 * Get the average of the aggregated measurements.
	 */
	readonly average: number;

	/**
	 * Get the number of aggregated measurements.
	 */
	readonly count: number;

	/**
	 * Get the name of the group that contains the aggregated measurements.
	 */
	readonly group: string;

	/**
	 * Get the maximum of the aggregated measurements.
	 */
	readonly max: number;

	/**
	 * Get the minimum of the aggregated measurements.
	 */
	readonly min: number;

	/**
	 * Get the standard deviation of the aggregated measurements.
	 */
	readonly stddev: number;

	/**
	 * Get the name of the aggregated measurements.
	 */
	readonly token: string;
}

/**
 * Data of one time measurement.
 */
declare interface GlobalTimeMeasurementLog {

	/**
	 * Get the shortest time over all logs. Returns 0, if no value for the corresponding id is logged to dva code profiler, yet.
	 */
	readonly description: string;

	/**
	 * Time passed since measurement has started for this given token.
	 */
	readonly time: number;

	/**
	 * Get the longest time over all logs. Returns 0, if no value for the corresponding id is logged to dva code profiler, yet.
	 */
	readonly token: string;
}

/**
 * Compute the hash of an object.
 */
declare class Hash {

	static readonly ALGORITHM_MURMUR3: string;
	static readonly PROVIDER_WAVEFILE: string;

	/**
	 * Compute the hash of an object. The first parameter has to be the hash algorithms, second parameter has to be the has provider. All remaining parameters are passed to the hash provider.
	 */
	static calculate(): string;
}

/**
 * Class to faciliate the creation of Lumetri Scopes object
 */
declare class LumetriScopes {

	scopesBitDepth: number;
	scopesColorSpace: number;
	scopesLayout: number;
	scopesLayout1: number;
	scopesLayout2: number;
	scopesLayout3: number;
	scopesLayout4: number;
	scopesParadeMode: number;
	scopesPlatformViewHeight: number;
	scopesPlatformViewWidth: number;
	scopesWaveformMode: number;

	/**
	 * Constructs a new Lumetri Scopes object.
	 */
	constructor();

	getScopesBitDepth(): number;
	getScopesColorSpace(): number;
	getScopesLayout(): number;
	getScopesLayout1(): number;
	getScopesLayout2(): number;
	getScopesLayout3(): number;
	getScopesLayout4(): number;
	getScopesParadeMode(): number;
	getScopesPlatformViewHeight(): number;
	getScopesPlatformViewWidth(): number;
	getScopesWaveformMode(): number;
	setScopesBitDepth(uArg1: number): boolean;
	setScopesColorSpace(uArg1: number): boolean;
	setScopesLayout(uArg1: number): boolean;
	setScopesLayout1(uArg1: number): boolean;
	setScopesLayout2(uArg1: number): boolean;
	setScopesLayout3(uArg1: number): boolean;
	setScopesLayout4(uArg1: number): boolean;
	setScopesParadeMode(uArg1: number): boolean;
	setScopesPlatformViewHeight(uArg1: number): boolean;
	setScopesPlatformViewWidth(uArg1: number): boolean;
	setScopesWaveformMode(uArg1: number): boolean;
}

/**
 * The ManifestObject object provides utilities to validate the application scripting interface.
 */
declare class Manifest {

	/**
	 * Return the difference of first party stored manifest and first party runtime manifest
	 */
	static compareFirstPartyManifests(): string;

	/**
	 * Return the difference of third party stored manifest and third party runtime manifest
	 */
	static compareManifests(): string;

	/**
	 * Generates a first party runtime manifest from namespaces.
	 */
	static generateFirstPartyManifest(): string;

	/**
	 * generate and return third party allow-list with hashes for every object
	 */
	static generateThirdPartyAllowList(allowList: string): string;

	/**
	 * generate and return third party manifest with an option to include description
	 */
	static generateThirdPartyManifest(includeDescription: boolean): string;

	/**
	 * Return the first party stored manifest.
	 */
	static getFirstpartyManifest(): string;

	/**
	 * Return third party stored allow lists
	 */
	static getThirdPartyAllowlist(): string;

	/**
	 * Based on the input namespaces, generates a manifest and validate it against the base manifest. If both manifest matches it returns true else false.
	 */
	static validateFirstpartyManifest(): boolean;

	/**
	 * Generates third party manifest from allow list and generated hash and will be compared against stored hash, return true if same.
	 */
	static validateThirdpartyManifest(): boolean;
}

/**
 * Provides GTest & Posix match function.
 */
declare class Matcher {

	/**
	 * Create a matcher using GTest glob rules.
	 */
	static createGTest(uArg1: string): object;

	/**
	 * Create a matcher using Posix glob rules.
	 */
	static createPosix(uArg1: string): object;

	/**
	 * Returns true if the string parameter matches the pattern and not the anti-pattern
	 */
	match(uArg1: string): boolean;
}

/**
 * OvershootCounter provides access to the number of overshoots that have been counted.
 */
declare interface OvershootCounter {

	/**
	 * Get the number of overshoots that have been counted and reset the counter for all buckets.
	 */
	getAndResetBuckets(): object;

	/**
	 * Get the number of overshoots that have been counted.
	 */
	getBuckets(): object;

	/**
	 * Reset the counter for all buckets.
	 */
	reset(): boolean;
}

/**
 * Wrapper class to connect to Premiere Pro server.
 */
declare interface PProServer {

	/**
	 * return server connection status.
	 */
	readonly connected: boolean;

	/**
	 * return server name.
	 */
	readonly displayName: string;

	/**
	 * Returns a list of opened projects.
	 */
	readonly projects: any[];

	/**
	 * return server error meesage.
	 */
	readonly statusMessage: string;

	/**
	 * Connect to Server.
	 */
	connect(): boolean;

	/**
	 * Disconnect from Server.
	 */
	disconnect(): boolean;

	/**
	 * Open Project.
	 */
	openProject(filePath: string): object;
}

/**
 * There are fixed sets of supported PixelFormats, choose one. Use with VideoFrame objects.
 */
declare class PixelFormat {

	/**
	 * BGRA_4444_15u - Alpha
	 */
	static readonly PIXELFORMAT_BGRA_4444_15U: string;

	/**
	 * BGRA_4444_32f - Alpha
	 */
	static readonly PIXELFORMAT_BGRA_4444_32F: string;

	/**
	 * BGRA_4444_32f_Linear - Alpha
	 */
	static readonly PIXELFORMAT_BGRA_4444_32F_LINEAR: string;

	/**
	 * BGRA_4444_8u - Alpha
	 */
	static readonly PIXELFORMAT_BGRA_4444_8U: string;

	/**
	 * BGRP_4444_15u -	Premultiplied Alpha
	 */
	static readonly PIXELFORMAT_BGRP_4444_15U: string;

	/**
	 * BGRP_4444_32f - Premultiplied Alpha
	 */
	static readonly PIXELFORMAT_BGRP_4444_32F: string;

	/**
	 * BGRP_4444_32f_Linear - Premultiplied Alpha
	 */
	static readonly PIXELFORMAT_BGRP_4444_32F_LINEAR: string;

	/**
	 * BGRP_4444_8u - Premultiplied Alpha
	 */
	static readonly PIXELFORMAT_BGRP_4444_8U: string;

	/**
	 * BGRX_4444_15u -	Alpha ignored/opaque
	 */
	static readonly PIXELFORMAT_BGRX_4444_15U: string;

	/**
	 * BGRX_4444_32f - Alpha ignored/opaque
	 */
	static readonly PIXELFORMAT_BGRX_4444_32F: string;

	/**
	 * BGRX_4444_32f_Linear - Alpha ignored/opaque
	 */
	static readonly PIXELFORMAT_BGRX_4444_32F_LINEAR: string;

	/**
	 * BGRX_4444_8u - Alpha ignored/opaque
	 */
	static readonly PIXELFORMAT_BGRX_4444_8U: string;

	/**
	 * UYVY_422_32f - 601 Primaries
	 */
	static readonly PIXELFORMAT_UYVY_422_32F: string;

	/**
	 * UYVY_422_32f_709 - 709 Primaries
	 */
	static readonly PIXELFORMAT_UYVY_422_32F_709: string;

	/**
	 * UYVY_422_8u - 601 Primaries
	 */
	static readonly PIXELFORMAT_UYVY_422_8U: string;

	/**
	 * UYVY_422_8u_709 - 709 Primaries
	 */
	static readonly PIXELFORMAT_UYVY_422_8U_709: string;

	/**
	 * V210_422_10u - 601 Primaries
	 */
	static readonly PIXELFORMAT_V210_422_10U: string;

	/**
	 * V210_422_10u_709 - 709 Primaries
	 */
	static readonly PIXELFORMAT_V210_422_10U_709: string;

	/**
	 * VUYA_4444_15u - Alpha
	 */
	static readonly PIXELFORMAT_VUYA_4444_15U: string;

	/**
	 * VUYA_4444_32f - Alpha, 601 Primaries
	 */
	static readonly PIXELFORMAT_VUYA_4444_32F: string;

	/**
	 * VUYA_4444_32f_709 - Alpha, 709 Primaries
	 */
	static readonly PIXELFORMAT_VUYA_4444_32F_709: string;

	/**
	 * VUYA_4444_8u - Alpha, 601 Primaries
	 */
	static readonly PIXELFORMAT_VUYA_4444_8U: string;

	/**
	 * VUYA_4444_8u_709 - Alpha, 709 Primaries
	 */
	static readonly PIXELFORMAT_VUYA_4444_8U_709: string;

	/**
	 * VUYA_4444_15u - Premultiplied Alpha
	 */
	static readonly PIXELFORMAT_VUYP_4444_15U: string;

	/**
	 * VUYA_4444_32f - Premultiplied Alpha, 601 Primaries
	 */
	static readonly PIXELFORMAT_VUYP_4444_32F: string;

	/**
	 * VUYA_4444_32f_709 - Premultiplied Alpha, 709 Primaries
	 */
	static readonly PIXELFORMAT_VUYP_4444_32F_709: string;

	/**
	 * VUYP_4444_8u - Premultiplied Alpha, 601 Primaries
	 */
	static readonly PIXELFORMAT_VUYP_4444_8U: string;

	/**
	 * VUYP_4444_8u_709 - Premultiplied Alpha, 709 Primaries
	 */
	static readonly PIXELFORMAT_VUYP_4444_8U_709: string;

	/**
	 * VUYX_4444_15u - Alpha ignored/opaque
	 */
	static readonly PIXELFORMAT_VUYX_4444_15U: string;

	/**
	 * VUYX_4444_32f - Alpha ignored/opaque, 601 Primaries
	 */
	static readonly PIXELFORMAT_VUYX_4444_32F: string;

	/**
	 * VUYX_4444_32f_709 - Alpha ignored/opaque, 709 Primaries
	 */
	static readonly PIXELFORMAT_VUYX_4444_32F_709: string;

	/**
	 * VUYX_4444_8u - Alpha ignored/opaque, 601 Primaries
	 */
	static readonly PIXELFORMAT_VUYX_4444_8U: string;

	/**
	 * VUYX_4444_8u_709 - Alpha ignored/opaque, 709 Primaries
	 */
	static readonly PIXELFORMAT_VUYX_4444_8U_709: string;

	/**
	 * YUYV_422_32f - 601 Primaries
	 */
	static readonly PIXELFORMAT_YUYV_422_32F: string;

	/**
	 * YUYV_422_32f_709 - 709 Primaries
	 */
	static readonly PIXELFORMAT_YUYV_422_32F_709: string;

	/**
	 * YUYV_422_8u - 601 Primaries
	 */
	static readonly PIXELFORMAT_YUYV_422_8U: string;

	/**
	 * YUYV_422_8u_709 - 709 Primaries
	 */
	static readonly PIXELFORMAT_YUYV_422_8U_709: string;

	/**
	 * Construct a supported PixelFormat
	 */
	static createPixelFormat(formatFourCC: string): PixelFormat;
}

declare interface Project {
	// In the internal dom, this may return with LumetriScopes instead of any/null
	getLumetriScopes(): LumetriScopes | null;
}

/**
 * Dynamiclink open project callback.
 */
declare interface ProjectConnectionEvent {

	/**
	 * Return connection event message.
	 */
	readonly message: string;

	/**
	 * Return connection event status.
	 */
	readonly succeeded: boolean;
}

/**
 * Dynamiclink connect to project items callback.
 */
declare interface ProjectItemsConnectionEvent {

	/**
	 * Return connection event message.
	 */
	readonly message: string;

	/**
	 * Return connection event status.
	 */
	readonly succeeded: boolean;
}

/**
 * Getting and setting property values of a property list
 */
declare class PropertyList {

	/**
	 * Is property list empty
	 */
	readonly empty: boolean;

	/**
	 * Get all existing property names
	 */
	readonly propertyNames: string[];

	/**
	 * constructor for empty property list
	 */
	constructor();

	/**
	 * Get value of type bool by key
	 */
	getBoolValue(key: string): boolean;

	/**
	 * Get value of type double by key
	 */
	getDoubleValue(key: string): number;

	/**
	 * Get value of type float by key
	 */
	getFloatValue(key: string): number;

	/**
	 * Get value of type array of integer (32-bit) by key
	 */
	getInt32ArrayValue(key: string): number[];

	/**
	 * Get value of type integer (32-bit) by key
	 */
	getInt32Value(key: string): number;

	/**
	 * Get type of property by key[0:unknown, 1:UTF16-String, 2:UTF8-String, 3:boolean, 4:unsigned integer (16-bit), 5:unsigned integer (32-bit), 6:integer (32-bit), 7:integer (64-bit), 8:unsigned integer (64-bit),9:float, 10:double, 11:list, 12:Array of UTF16-Strings, 13:Array of UTF8-Strings, 14:Array of boolean, 15:Array of unsigned integer (16-bit), 16:Array of unsigned integer (32-bit),17:Array of integer (32-bit), 18:Array of integer (64-bit), 19:Array of unsigned integer (64-bit), 20:Array of float, 21:Array of double]
	 */
	getPropertyType(key: string): number;

	/**
	 * Get value of type Array of UTF16-Strings by key
	 */
	getStringUTF16ArrayValue(key: string): string[];

	/**
	 * Get value of type UTF16-String by key
	 */
	getStringUTF16Value(key: string): string;

	/**
	 * Get value of type unsigned integer (32-bit) by key
	 */
	getUint32Value(key: string): number;

	/**
	 * Is there a value under the given key in this list
	 */
	hasKey(key: string): boolean;

	/**
	 * Set value of type bool by key
	 */
	setBoolValue(key: string, value: boolean): boolean;

	/**
	 * Set value of type double by key
	 */
	setDoubleValue(key: string, value: number): boolean;

	/**
	 * Set value of type float by key
	 */
	setFloatValue(key: string, value: number): boolean;

	/**
	 * Set value of type Array of integer (32-bit) by key
	 */
	setInt32ArrayValue(key: string, value: number[]): boolean;

	/**
	 * Set value of type integer (32-bit) by key
	 */
	setInt32Value(key: string, value: number): boolean;

	/**
	 * Set value of type Array of UTF16-Strings by key
	 */
	setStringUTF16ArrayValue(key: string, value: string[]): boolean;

	/**
	 * Set value of type UTF16-String by key
	 */
	setStringUTF16Value(key: string, value: string): boolean;

	/**
	 * Set value of type unsigned integer (32-bit) by key
	 */
	setUint32Value(key: string, value: number): boolean;

}

/**
 * Reset the system provided random number generator by calling srand().
 */
declare class Random {

	/**
	 * Reset the system provided random number generator by calling srand().
	 */
	static reset(): boolean;
}

/**
 * Ratio time has a value and time scale.
 */
declare class RatioTime {

	/**
	 * Ratio time scale.
	 */
	scale: number;

	/**
	 * Ratio time value.
	 */
	value: number;

	/**
	 * Construct a ratio time.
	 */
	static createRatioTime(value: number, scale: number): RatioTime;
}

/**
 * Return the registered directories, expose new folder types as needed.
 */
declare class RegisteredDirectories {

	/**
	 * Parameter - user desktop directory - On Mac: ~|Desktop. On Windows: Users|<username>|Desktop
	 */
	static readonly DESKTOP_DIR: number;

	/**
	 * Parameter - DVA Shared Documents directory - On Mac: ~|Library|Application Support|Adobe|Common. On Windows: Users|<username>|AppData|Roaming|Adobe|Common
	 */
	static readonly DVA_SHAREDDOCS_DIR: number;

	/**
	 * Parameter - user documents directory - On Mac: ~|Documents. On Windows: Users|<username>|Documents
	 */
	static readonly USERDOCUMENTS_DIR: number;

	/**
	 * Parameter - user downloads directory - On Mac: ~|Downloads. On Windows: Users|<username>|Downloads
	 */
	static readonly USERDOWNLOADS_DIR: number;

	/**
	 * Parameter - user home directory - On Mac: ~. On Windows: Users|<username>
	 */
	static readonly USERHOME_DIR: number;

	/**
	 * Parameter - user movies directory - On Mac: ~|Movies. On Windows: Users|<username>|Videos
	 */
	static readonly USERMOVIES_DIR: number;

	/**
	 * Parameter - user music directory - On Mac: ~|Music. On Windows: Users|<username>|Music
	 */
	static readonly USERMUSIC_DIR: number;

	/**
	 * Parameter - user pictures directory - On Mac: ~|Pictures. On Windows: Users|<username>|Pictures
	 */
	static readonly USERPICTURES_DIR: number;

	/**
	 * Return the registered directory, use one of the existing const properties - USERDOCUMENTS_DIR; DESKTOP_DIR; DVA_SHAREDDOCS_DIR; USERDOWNLOADS_DIR; USERHOME_DIR; USERMOVIES_DIR; USERMUSIC_DIR; USERPICTURES_DIR
	 */
	static getRegisteredDirectoryByType(registeredDirectoryType: number): string;
}

/**
 * Dynamiclink render audio callback.
 */
declare interface RenderAudioConnectionEvent {

	/**
	 * Return connection event message.
	 */
	readonly message: string;

	/**
	 * Return connection event status.
	 */
	readonly succeeded: boolean;
}

/**
 * RenderQuality enum
 */
declare class RenderQuality {

	/**
	 * Render Quality Draft
	 */
	static readonly DRAFT: number;

	/**
	 * Render Quality High
	 */
	static readonly HIGH: number;

	/**
	 * Render Quality Low
	 */
	static readonly LOW: number;

	/**
	 * Render Quality Max
	 */
	static readonly MAX: number;

	/**
	 * Render Quality Medium
	 */
	static readonly MEDIUM: number;
}

/**
 * Dynamiclink render video callback.
 */
declare interface RenderVideoConnectionEvent {

	/**
	 * Return connection event message.
	 */
	readonly message: string;

	/**
	 * Return connection event status.
	 */
	readonly succeeded: boolean;

}

/**
 * Dynamiclink connect to server callback.
 */
declare interface ServerConnectionEvent {

	/**
	 * Return connection event message.
	 */
	readonly message: string;

	/**
	 * Return connection event status.
	 */
	readonly succeeded: boolean;
}

/**
 * Dynamiclink connect to source callback.
 */
declare interface SourceConnectionEvent {

	/**
	 * Return connection event message.
	 */
	readonly message: string;

	/**
	 * Return connection event status.
	 */
	readonly succeeded: boolean;
}

/**
 * TransmitTestPlugin Class
 */
declare class TransmitTestPlugin {

	/**
	 * Create instance of this Class
	 */
	static createTransmitPluginObject(): TransmitTestPlugin;

	/**
	 * Check color conversion accuracy and log the result
	 */
	enableColorConversionLog(uArg1: boolean): boolean;

	/**
	 * Enable/Disable video for TransmitTest plugin
	 */
	enableTransmitVideo(uArg1: boolean): boolean;

	/**
	 * Field type of frame
	 */
	setFieldType(uArg1: number): boolean;

	/**
	 * Resolution of frame requested from TransmitHost
	 */
	setFrameResolution(uArg1: number, uArg2: number): boolean;

	/**
	 * Graphics White Luminance of Project
	 */
	setGraphicsWhiteLuminance(uArg1: number): boolean;

	/**
	 * This is used for matching the color conversion accuracy
	 */
	setMatchThreshold(uArg1: number): boolean;

	/**
	 * Plugin request frame in this color space from TransmitHost
	 */
	setPluginColorSpace(ColorSpace: object): boolean;

	/**
	 * Plugin request frame in this pixel format from TransmitHost
	 */
	setPluginPixelFormat(PixelFormat: object): boolean;

	/**
	 * Color space of the rendered frame
	 */
	setRenderColorSpace(ColorSpace: object): boolean;
}

/**
 * UIAutomation object provides utilities to interoperate with drover's OS based UI system, to facilitate test scenarios.
 */
declare interface UIAutomation {

	/**
	 * SHORT DESCRIPTION HERE
	 */
	readonly helper: UIAutomationHelper;

	/**
	 * Return current cursorID, if not found, return -1
	 */
	GetCurrentCursorID(): number;

	/**
	 * Resets all modifier keys to their default state. Useful to call between tests.
	 */
	clearModifierKeys(): boolean;

	/**
	 * SHORT DESCRIPTION HERE
	 */
	doesMenuItemExist(windowIds: string[], menuIds: string[]): boolean;

	/**
	 * SHORT DESCRIPTION HERE
	 */
	doesObjectExist(id: string[]): boolean;

	/**
	 * SHORT DESCRIPTION HERE
	 */
	getBooleanProperty(ids: string[], name: string): boolean;

	/**
	 * SHORT DESCRIPTION HERE
	 */
	getFloatProperty(ids: string[], name: string): number;

	/**
	 * SHORT DESCRIPTION HERE
	 */
	getGlobalRectForObject(id: string[]): number[];

	/**
	 * SHORT DESCRIPTION HERE
	 */
	getGlobalXPosForObject(id: string[]): number;

	/**
	 * SHORT DESCRIPTION HERE
	 */
	getGlobalYPosForObject(id: string[]): number;

	/**
	 * SHORT DESCRIPTION HERE
	 */
	getIntegerProperty(ids: string[], name: string): number;

	/**
	 * SHORT DESCRIPTION HERE
	 */
	getMenuItemCommandId(windowIds: string[], menuIds: string[]): number;

	/**
	 * SHORT DESCRIPTION HERE
	 */
	getMenuItemIndex(windowIds: string[], menuIds: string[]): number;

	/**
	 * SHORT DESCRIPTION HERE
	 */
	getMenuItemString(windowIds: string[], menuIds: string[]): string;

	/**
	 * SHORT DESCRIPTION HERE
	 */
	getNodeAdapterName(ids: string[]): string;

	/**
	 * SHORT DESCRIPTION HERE
	 */
	getStringProperty(ids: string[], name: string): string;

	/**
	 * Returns true if App process is trusted by the OS as an Accessibility client used in by the UIAutomationDriver
	 */
	isAppTrustedForAutomation(): boolean;

	/**
	 * SHORT DESCRIPTION HERE
	 */
	isMenuItemAMenu(windowIds: string[], menuIds: string[]): boolean;

	/**
	 * SHORT DESCRIPTION HERE
	 */
	isMenuItemChecked(windowIds: string[], menuIds: string[]): boolean;

	/**
	 * SHORT DESCRIPTION HERE
	 */
	isMenuItemEnabled(windowIds: string[], menuIds: string[]): boolean;

	/**
	 * SHORT DESCRIPTION HERE
	 */
	isPlayingUIAutomationScript(): boolean;

	/**
	 * SHORT DESCRIPTION HERE
	 */
	isRecordingUIAutomationScript(): boolean;

	/**
	 * SHORT DESCRIPTION HERE
	 */
	performKeyboardAction(keyCode: number, eventType: number): boolean;

	/**
	 * SHORT DESCRIPTION HERE
	 */
	performMouseAction(ids: string[], action: number, button: number, x: number, y: number, clicks: number): boolean;

	/**
	 * SHORT DESCRIPTION HERE
	 */
	performPickMenuItemAction(windowIds: string[], menuIds: string[]): boolean;

	/**
	 * SHORT DESCRIPTION HERE
	 */
	performSelectMenuItemAction(windowIds: string[], menuIds: string[]): boolean;

	/**
	 * SHORT DESCRIPTION HERE
	 */
	performTypeTextAction(text: string): boolean;

	/**
	 * SHORT DESCRIPTION HERE
	 */
	playUIAutomationScript(name: string): boolean;

	/**
	 * SHORT DESCRIPTION HERE
	 */
	recordUIAutomationScript(name: string): boolean;

	/**
	 * SHORT DESCRIPTION HERE
	 */
	stopPlayingUIAutomationScript(): boolean;

	/**
	 * SHORT DESCRIPTION HERE
	 */
	stopRecordingUIAutomationScript(): boolean;
}

/**
 * UI automation helper object
 */
declare class UIAutomationHelper {

	/**
	 * Execute console command
	 */
	static executeConsoleCommand(snippet: string): string;
}

/**
 * UIControl event object
 */
declare class UIControlEvent {

	/**
	 * A UI control is about to change its value.
	 */
	static readonly EVENT_VALUE_CHANGED: string;

	/**
	 * Absolut path to UI control.
	 */
	readonly ctrlPath: string;

	/**
	 * Node ID of UI control.
	 */
	readonly nodeID: string;
}

/**
 * Collection of useful functions, add to this as needed - defaults to private visibility.
 */
declare class UtilityFunctions {

	/**
	 * Return a guid generated by dva's tech
	 */
	static createUniqueGUID(): string;
}

/**
 * VideoFrameObjectr holds an MF::IVideoFrameRef, exposes various helpful scripting functions, returned by various utility functions (like render from sequence)
 */
declare interface VideoFrame {

	/**
	 * The Height of the VideoFrame in pixels - returns 0 if the held VideoFrame is null
	 */
	readonly boundsHeight: number;

	/**
	 * The Width of the VideoFrame in pixels - returns 0 if the held VideoFrame is null
	 */
	readonly boundsWidth: number;

	/**
	 * The pixel aspect ratio of the held VideoFrame - ReadOnly. Returns 0.0 if the held VideoFrame is null
	 */
	readonly pixelAspectRatio: number;

	/**
	 * The pixelFormat of the held VideoFrame - ReadOnly. Returns 0 if held VideoFrame is null
	 */
	readonly pixelFormat: string;

	/**
	 * Pixel values held in the VideoFrame for given coordinates - ReadOnly. Returns 0 if held VideoFrame is null
	 */
	pixelForCoordinates(uArg1: number[], uArg2: number[]): number[];
}

/**
 * Video render options for rendering a video frame.
 */
declare class VideoRenderOptions {

	/**
	 * Video render options height.
	 */
	height: number;

	/**
	 * Video render options width.
	 */
	width: number;

	/**
	 * Construct video render options.
	 */
	static createVideoRenderOptions(width: number, height: number): VideoRenderOptions;
}

/**
 * Dynamiclink connect to video renderer callback.
 */
declare interface VideoRendererConnectionEvent {

	/**
	 * Return connection event message.
	 */
	readonly message: string;

	/**
	 * Return connection event status.
	 */
	readonly succeeded: boolean;
}

/**
 * Holds information about virtual audio device class
 */
declare class VirtualAudioDeviceClass {

	/**
	 * Get a vector of AudioDeviceClassObjects
	 */
	static readonly audioDeviceClasses: any[];

	/**
	 * Returns the class identifier
	 */
	readonly classID: number;

	/**
	 * Returns the class name
	 */
	readonly className: string;

	/**
	 * Returns a vector of AudioDeviceInfoExtendScriptObjects refering to input devices
	 */
	readonly inputDevices: any[];

	/**
	 * Returns a vector of AudioDeviceInfoExtendScriptObjects refering to output devices
	 */
	readonly outputDevices: any[];

	/**
	 * Get an AudioDeviceClassObject by its class name.
	 */
	static audioDeviceClassByName(className: string): AudioDeviceClass;

	/**
	 * Returns an info object for the given device property ID.
	 */
	propertyInfo(property: number): AudioDevicePropertyInfo;
}

/**
 * Virtual audio device event
 */
declare interface VirtualAudioDeviceEvent {
}

/**
 * Holds information about virtual audio device depending on class ID and device UID
 */
declare interface VirtualAudioDeviceInfo {

	/**
	 * An array of I/O blocksizes the device supports
	 */
	readonly availableIOBlockSizes: number[];

	/**
	 * An array of available sample rates
	 */
	readonly availableSampleRates: number[];

	/**
	 * Whether device generates a sine tone on all input channels.
	 */
	generateSineTone: boolean;

	/**
	 * The input channel count of the device
	 */
	inputChannelCount: number;

	/**
	 * The input latency of the device
	 */
	inputLatency: number;

	/**
	 * Whether loopback of the device is enabled
	 */
	loopback: boolean;

	/**
	 * The name of the device
	 */
	readonly name: string;

	/**
	 * If a device doesn't have any input channels, the return value is zero.
	 */
	readonly numberOfInputChannels: number;

	/**
	 * If a device doesn't have any output channels, the return value is zero.
	 */
	readonly numberOfOutputChannels: number;

	/**
	 * The output channel count of the device
	 */
	outputChannelCount: number;

	/**
	 * The output latency of the device
	 */
	outputLatency: number;

	/**
	 * The sample rate of the device
	 */
	sampleRate: number;

	/**
	 * The UID of the device
	 */
	readonly uid: string;

	/**
	 * Request to start recording the device output to the specified file path. There will be an event as soon as recording has started.
	 */
	startRecording(filePath: string): boolean;

	/**
	 * Request to stop recording the device output. There will be an event as soon as recording has stopped.
	 */
	stopRecording(): boolean;
}

/**
 * An object representing a VirtualAudioFilter to be used for automated testing.
 */
declare interface VirtualAudioFilter {

	/**
	 * The ID of the audio filter.
	 */
	readonly ID: string;

	/**
	 * The display name of this audio filter.
	 */
	readonly displayName: string;

	/**
	 * The input buses of the audio filter.
	 */
	readonly inputBuses: any[];

	/**
	 * The latency value in sample frames of the virtual audio filter
	 */
	latency: number;

	/**
	 * The output buses of the audio filter.
	 */
	readonly outputBuses: any[];

	/**
	 * Return the number of parameters.
	 */
	readonly parameterCount: number;

	/**
	 * Assignes a channel mapping.
	 */
	assignChannelMapping(isInput: boolean, filterChannel: number, targetChannel: number): boolean;

	/**
	 * Returns the channel index for a target bus channel.
	 */
	getFilterChannelForTarget(isInput: boolean, targetChannel: number): number;

	/**
	 * Return the value of the parameter at <index>.
	 */
	getParameter(index: number): number;

	/**
	 * Removes the channel mapping for a filter channel.
	 */
	removeChannelMapping(isInput: boolean, filterChannel: number): boolean;

	/**
	 * Requests the input/output bus configuration from the audio filter.
	 */
	requestBusConfiguration(inputs: any[], outputs: any[]): boolean;

	/**
	 * Request to stop routing audio from the input file to the filter output. Should only be called when the filter is suspended.
	 */
	resetInputFile(): boolean;

	/**
	 * Request to stop recording the device input. Should only be called when the filter is suspended.
	 */
	resetOutputFile(): boolean;

	/**
	 * Request to route audio from the specified file path to the filter output. Should only be called when the filter is suspended.
	 */
	setInputFile(filePath: string): boolean;

	/**
	 * Request to start recording the filter input to the specified file path. Should only be called when the filter is suspended.
	 */
	setOutputFile(filePath: string): boolean;

	/**
	 * Set the value of the parameter at <index>.
	 */
	setParameter(index: number, value: number): boolean;
}

/**
 * This event propagates state changes in virtual audio filters.
 */
declare class VirtualAudioFilterEvent {

	/**
	 * A VirtualAudioFilter object has been constructed.
	 */
	static readonly EVENT_CONSTRUCTED: string;

	/**
	 * A VirtualAudioFilter object has been destroyed.
	 */
	static readonly EVENT_DESTROYED: string;

	/**
	 * A VirtualAudioFilter object has been resumed.
	 */
	static readonly EVENT_RESUMED: string;

	/**
	 * A VirtualAudioFilter object has been suspended.
	 */
	static readonly EVENT_SUSPENDED: string;
}

/**
 * This object can hold waveform data for multiple channels.
 */
declare class WaveformData {

	/**
	 * The associate WaveformDataObject is not initialized.
	 */
	static readonly TYPE_NONE: string;

	/**
	 * The associate WaveformDataObject contains peak values.
	 */
	static readonly TYPE_PEAKS: string;

	/**
	 * The associate WaveformDataObject contains sample values.
	 */
	static readonly TYPE_SAMPLES: string;

	/**
	 * Returns the data for the requested channel of this WaveformData. The peak data is structured as a vector of objects having min and max values if getType is TYPE_PEAKS, otherwise one value per sample.
	 */
	getChannel(index: number): any[];

	/**
	 * Get the channel count of this WaveformData.
	 */
	getChannelCount(): number;

	/**
	 * Returns the Type of this WaveformData, i.e., if the buffer contains samples or min/max peak pairs.
	 */
	getType(): string;
}