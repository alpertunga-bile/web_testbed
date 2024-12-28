

const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder = (typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : { encode: () => { throw Error('TextEncoder not available') } } );

const encodeString = function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
};

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}
/**
 * @param {CacherOptions} options
 * @param {string} data
 * @returns {Uint8Array}
 */
export function get_compressed_cacher_info(options, data) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(options, CacherOptions);
        const ptr0 = passStringToWasm0(data, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.get_compressed_cacher_info(retptr, options.__wbg_ptr, ptr0, len0);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var v2 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1, 1);
        return v2;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8ArrayMemory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}
/**
 * @param {Uint8Array} info
 * @returns {CacherReturnInfo}
 */
export function get_decompressed_data(info) {
    const ptr0 = passArray8ToWasm0(info, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.get_decompressed_data(ptr0, len0);
    return CacherReturnInfo.__wrap(ret);
}

/**
 * @enum {0 | 1 | 2 | 3}
 */
export const CacherCompression = Object.freeze({
    InvalidUtf16: 0, "0": "InvalidUtf16",
    Base64: 1, "1": "Base64",
    ValidUtf16: 2, "2": "ValidUtf16",
    Uri: 3, "3": "Uri",
});
/**
 * @enum {0 | 1 | 2 | 3 | 4 | 5 | 6 | 7}
 */
export const CacherDateRemainingUnit = Object.freeze({
    Milliseconds: 0, "0": "Milliseconds",
    Seconds: 1, "1": "Seconds",
    Minutes: 2, "2": "Minutes",
    Hours: 3, "3": "Hours",
    Days: 4, "4": "Days",
    Weeks: 5, "5": "Weeks",
    Months: 6, "6": "Months",
    Years: 7, "7": "Years",
});

const CacherOptionsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_cacheroptions_free(ptr >>> 0, 1));

export class CacherOptions {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        CacherOptionsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_cacheroptions_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.cacheroptions_new();
        this.__wbg_ptr = ret >>> 0;
        CacherOptionsFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {string}
     */
    get save_path() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.cacheroptions_save_path(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {string} path
     */
    set save_path(path) {
        const ptr0 = passStringToWasm0(path, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.cacheroptions_set_save_path(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {CacherCompression}
     */
    get compression_type() {
        const ret = wasm.cacheroptions_compression_type(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {CacherCompression} compress_type
     */
    set compression_type(compress_type) {
        wasm.cacheroptions_set_compression_type(this.__wbg_ptr, compress_type);
    }
    /**
     * @returns {CacherDateRemainingUnit}
     */
    get remaining_time_unit() {
        const ret = wasm.cacheroptions_remaining_time_unit(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {CacherDateRemainingUnit} time_unit
     */
    set remaining_time_unit(time_unit) {
        wasm.cacheroptions_set_remaining_time_unit(this.__wbg_ptr, time_unit);
    }
    /**
     * @returns {bigint}
     */
    get remaining_time() {
        const ret = wasm.cacheroptions_remaining_time(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {bigint} time
     */
    set remaining_time(time) {
        wasm.cacheroptions_set_remaining_time(this.__wbg_ptr, time);
    }
}

const CacherReturnInfoFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_cacherreturninfo_free(ptr >>> 0, 1));

export class CacherReturnInfo {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CacherReturnInfo.prototype);
        obj.__wbg_ptr = ptr;
        CacherReturnInfoFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        CacherReturnInfoFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_cacherreturninfo_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.cacherreturninfo_new();
        this.__wbg_ptr = ret >>> 0;
        CacherReturnInfoFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {string}
     */
    get data() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.cacherreturninfo_data(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {boolean}
     */
    get is_expired() {
        const ret = wasm.cacherreturninfo_is_expired(this.__wbg_ptr);
        return ret !== 0;
    }
}

const imports = {
    __wbindgen_placeholder__: {
        __wbg_getTime_ab8b72009983c537: function(arg0) {
            const ret = getObject(arg0).getTime();
            return ret;
        },
        __wbg_new0_55477545727914d9: function() {
            const ret = new Date();
            return addHeapObject(ret);
        },
        __wbindgen_object_drop_ref: function(arg0) {
            takeObject(arg0);
        },
        __wbindgen_throw: function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
        },
    },

};

const wasm_url = new URL('cacher_wasm_bg.wasm', import.meta.url);
let wasmCode = '';
switch (wasm_url.protocol) {
    case 'file:':
    wasmCode = await Deno.readFile(wasm_url);
    break
    case 'https:':
    case 'http:':
    wasmCode = await (await fetch(wasm_url)).arrayBuffer();
    break
    default:
    throw new Error(`Unsupported protocol: ${wasm_url.protocol}`);
}

const wasmInstance = (await WebAssembly.instantiate(wasmCode, imports)).instance;
const wasm = wasmInstance.exports;
export const __wasm = wasm;

