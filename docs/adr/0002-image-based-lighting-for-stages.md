# Image-based lighting for Stages

Stages light Models with a pre-made environment image (a 360° picture with bright light patches painted in) inside `<model-viewer>`, rather than with real Three.js spotlights. `<model-viewer>` has no public API for individual lights; adding them would mean relying on library internals or writing a custom renderer. The accepted cost is that the Showroom stage's "lights" give illumination and reflections but no visible beams or hard spotlight shadows. Revisit only if a Stage genuinely needs real light sources.
