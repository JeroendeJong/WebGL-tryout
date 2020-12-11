  #ifdef GL_ES
    precision mediump float;
    #endif
    
    #define PI 3.14159265359
    
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;
    uniform float u_time;
    
    float plot(vec2 st, float pct){
      return  smoothstep( pct-0.02, pct, st.y) -
              smoothstep( pct, pct+0.02, st.y);
    }
    
    void main() {
      vec2 st = gl_FragCoord.xy/u_resolution;
  
      float y_bottom_modifier = clamp(cos(u_time), 0.2, 0.5);
      float y_top_modifier = clamp(sin(u_time), 0.5, 0.8);

      float y_bottom = cos(st.x) * y_bottom_modifier;
      float y_top = sin(st.x) * y_top_modifier + 0.1;

      float x_bottom = smoothstep(0.0, 1.0, st.y);
      float x_top = smoothstep(1.0, 0.2, st.y);

      float sin_wave_bottom = step(y_bottom, x_bottom);
      float sin_wave_top = step(y_top, x_top);

      vec3 color = vec3(sin_wave_bottom) * vec3(sin_wave_top);

      gl_FragColor = vec4(color,1.0);
    }