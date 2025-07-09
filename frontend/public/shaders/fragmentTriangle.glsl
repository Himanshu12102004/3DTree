#version 300 es
precision highp float;
out vec4 fragColor;

uniform float minI;
uniform float maxY;
uniform float minX;
uniform float maxX;
uniform float minZ;
uniform float maxZ;

uniform vec3 cameraPosition;
uniform vec2 cameraDirection;

uniform float iTime;

uniform vec2 viewportDimensions;

uniform float angleX;
uniform float angleZ;

uniform int iterationCount;
uniform float opSmoothRatio;
uniform float rootRadius;
uniform float rootHeight;
uniform vec3 rootColor;
uniform vec3 branchColor;
uniform float dampeningFactor;
uniform vec3 cellDimensions;

vec3 materialColor=vec3(0.0);

mat2 rot2D(float angle){
  float s=sin(angle);
  float c=cos(angle);
  return mat2(c,-s,s,c);
}

float sdCappedCylinder( vec3 p, float h, float r )
{
  vec2 d = abs(vec2(length(p.xz),p.y)) - vec2(r,h);
  return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}


float sdBox( vec3 p, vec3 b )
{
  vec3 q = abs(p) - b;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}

float opSmoothUnion( float d1, float d2, float k )
{
    float h = clamp( 0.5 + 0.5*(d2-d1)/k, 0.0, 1.0 );
    return mix( d2, d1, h ) - k*h*(1.0-h);
}

float SDF(vec3 p){
  float lastHeight=rootHeight;
  float lastRadius=rootRadius;

  vec3 q=p;
  // q.z += iTime*cellDimensions.z*0.5;
  // Modular repetition with centering
  q.xz = mod(q.xz + 0.5 * cellDimensions.xz, cellDimensions.xz) - 0.5 * cellDimensions.xz;
  
  float root = sdCappedCylinder(q,lastHeight,lastRadius);
  
  float d=root;
  materialColor=rootColor;
  float ground=q.y+0.75;
  d=opSmoothUnion(root,ground,1.0);
  float radiusDecayFactor = 2.414213562373095; // 1 + sqrt(2)
  for(int i=0;i<iterationCount;i++){
    float branchHeight=lastHeight*dampeningFactor;
    float branchRadius=lastRadius/(radiusDecayFactor);

    q = vec3(abs(q.x),q.y,abs(q.z))-vec3(branchRadius,lastHeight,branchRadius);

    float negativeAngleX=-angleX;
    q.xy*=rot2D(angleZ);
    q.yz*=rot2D(negativeAngleX);

    float cylinder = sdCappedCylinder(q,branchHeight,branchRadius);

    if(d>cylinder){
    float t = float(i) / 10.0; 
    materialColor = mix(rootColor, branchColor, t); 
    }

    d=opSmoothUnion(d,cylinder,opSmoothRatio);

    lastHeight=branchHeight;
    lastRadius=branchRadius;
  }
  return d;
}

vec3 getNormal(vec3 p) {
  //to calculate the normals 
  // 1. Get the SDF at point p
  // 2. Get the SDFs a little left,into and down of p
  // 3. normal=vec3(SDF(p))-vec3(SDF(pLittleLeft),SDF(pLittleDown),SDF(pLittleInto)));
  vec2 e=vec2(0.001,0);

  vec3 normal=vec3(SDF(p))-vec3(
    SDF(p-e.xyy),
    SDF(p-e.yxy),
    SDF(p-e.yyx)
  );

  return normalize(normal);
}

void main() {
  
  vec2 fragCoord= vec2(
    gl_FragCoord.x * (maxX - minX) / viewportDimensions.x + minX,
    gl_FragCoord.y * (maxY - minI) / viewportDimensions.y + minI
  );

    vec2 uv=(gl_FragCoord.xy*2.0-viewportDimensions.xy)/viewportDimensions.y;
  //Initialization
  vec3 ro=cameraPosition;//Ray origin or camera location
  vec3 rd=normalize(vec3(uv,1));//Ray direction 
  float t=0.0; //total distance travelled by a ray in the scene

  // changing the look at vector in vertical Direction
  rd.yz*=rot2D(cameraDirection.y);
  // changing the look at vector in horizontal Direction
  rd.xz*=rot2D(-cameraDirection.x);

  bool hit=true;
  //Raymarching
  vec3 p;
  for(int i=0;i<80;i++){
    p=ro+rd*t;
    float d=SDF(p);
    t+=d;

    if(d<0.0001){
      break;
    }
    if(t>500.0){
      hit=false;
      break;
    }
  }
if(hit){
  // Ambient Light
  vec3 ambient=vec3(0.5,0.5,0.5);

  // Diffuse Light
  vec3 lightColor=vec3(1,1,1);
  vec3 lightPosition = ro + rd*0.001;

  // 1. Get the normal vector
  vec3 normal=getNormal(p);

  // 2. Get the light direction at the point where you want the diffuse light effect 
  vec3 lightDir = normalize(lightPosition - p);

  // 3. Calculate the dot product of normal and light direction
  float diffuseStrength= max(dot(normal, lightDir), 0.0);

  // 4. Diffuse light = lightColor times diffuseStrength
  vec3 diffuseLight = lightColor * diffuseStrength;

  //Specular Lighting
  // vec3 normalizedCameraDirection=normalize(rd);
  // vec3 reflectSource=normalize(reflect(lightDir,normal));
  // float specularStrength=max(0.0,dot(normalizedCameraDirection,reflectSource));
  // specularStrength=pow(specularStrength,64.0);
  // vec3 specular=specularStrength*lightColor;

  // Calculate final Lighting
  vec3 lighting=vec3(0);
  lighting=ambient+diffuseLight;
  materialColor=materialColor*lighting;
  fragColor = vec4(materialColor,1.0);
}
else{
  fragColor = vec4(0.0, 0.0, 0.0, 1.0); 
}
}