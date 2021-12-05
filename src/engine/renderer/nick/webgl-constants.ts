export const STATIC_DRAW = 0x88e4;
export const ARRAY_BUFFER = 0x8892;
export const ELEMENT_ARRAY_BUFFER = 0x8893;
export const BUFFER_SIZE = 0x8764;

export const BYTE = 0x1400;
export const UNSIGNED_BYTE = 0x1401;
export const SHORT = 0x1402;
export const UNSIGNED_SHORT = 0x1403;
export const INT = 0x1404;
export const UNSIGNED_INT = 0x1405;
export const FLOAT = 0x1406;
export const BOOL = 0x8b56;

export const SHADER_DATA_TYPE_TO_WEBGL_BASE_TYPE: Record<ShaderDataType, number> = {
  float: FLOAT,
  float2: FLOAT,
  float3: FLOAT,
  float4: FLOAT,
  mat3: FLOAT,
  mat4: FLOAT,
  int: INT,
  int2: INT,
  int3: INT,
  int4: INT,
  bool: BOOL,
};

export type ShaderDataType =
  | "float"
  | "float2"
  | "float3"
  | "float4"
  | "mat3"
  | "mat4"
  | "int"
  | "int2"
  | "int3"
  | "int4"
  | "bool";

export const SHADER_DATA_TYPE_SIZE: Record<ShaderDataType, number> = {
  float: 4,
  float2: 4 * 2,
  float3: 4 * 3,
  float4: 4 * 4,
  mat3: 4 * 3 * 3,
  mat4: 4 * 4 * 4,
  int: 4,
  int2: 4 * 2,
  int3: 4 * 3,
  int4: 4 * 4,
  bool: 1,
};

export const SHADER_DATA_TYPE_COUNT = {
  float: 1,
  float2: 2,
  float3: 3,
  float4: 4,
  mat3: 3 * 3,
  mat4: 4 * 4,
  int: 1,
  int2: 2,
  int3: 3,
  int4: 4,
  bool: 1,
};
