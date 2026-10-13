# Wave-packet recorder · episode83

Figure, about30–90 minutes including validation. Approved script sections “Why needles matter: the Fourier connection” and “Wave packets with numbers” motivate a bounded Gaussian Fourier pair. This independently authored one-dimensional teaching recorder does not implement the sphere-cap/tube scaling or validate Kakeya/restriction/research/Lean claims.

Two recording cartridges share one complex Gaussian packet. Narrowing its spectral Gaussian broadens its spatial envelope. Left paper shows the real part plus ±envelope; right paper shows the magnitude of the COMPLEX packet transform, divided by its actual peak (explicit normalization). Phase changes the left oscillation while leaving spectral magnitude and both widths unchanged. Manual phase sweep ends after one turn; no propagation/PDE/FFT is simulated.

With Fourier convention fhat(ν)=∫f(x)exp(−2πiνx)dx:
f(x)=exp(−2π²σ²x²)exp[2πi(kx+φ)] and
fhat(ν)=exp(2πiφ)/(sqrt(2π)σ) exp[−(ν−k)²/(2σ²)].
Energy density |f|² has RMS width1/(2sqrt(2)πσ); |fhat|² has centred RMS widthσ/sqrt(2); product1/(4π). Infinite-line complex energy=1/(2sqrt(π)σ), not the energy of just the plotted real part. Fixed plot windows x±8/amplitude±1 and ν−1…2/peak-normalized magnitude0…1. All quantities are normalized mathematical units. Gaussian tails extend past the finite display; it is not compactly supported.400 segments connect analytic samples and do not establish certified numerical bounds.

Controls σ.04… .4 step.01, carrier k.1…1 step.01, phase0…1 step.001, spatial probe−8…8 step.05, spectral probe−1…2 step.01. Four presets. Two dials use distinct fixed calibrations: spatial RMS0…3 and spectral RMS0… .3. Two knurled knobs correspond to bandwidth and phase; scientific traces/markers/needles are overlays in real holders.

Parts planned before geometry:8foot pads/posts, base1,4corner screws; two cartridge assemblies each2feet, bed,4rim bars,8rim screws and6roller parts=42; two dials eachflange/body/face/spindle/2screws=12; two knobseat/shaft/grip=6; nameplate+2screws=3. Total76 true static solids. Record every actual slab/cylinder; measure support/clearance/coverage/depth order before painting. Use existing kit, no widened sandbox or2000height cap.

Primary sources read: UCSD Jim Branson Gaussian transform/RMS derivation (2013), https://quantummechanics.ucsd.edu/ph130a/130_notes/node88.html ; MIT8.03SC Lecture15 (2016), https://ocw.mit.edu/courses/8-03sc-physics-iii-vibrations-and-waves-fall-2016/d9108c1fda9ceb21d2f933f6dabde66f_MIT8_03SCF16_Lec15.pdf . Their angular-frequency convention is converted explicitly to cycles/unit here. Independent direct complex Fourier quadrature, both energy moments, Parseval checks, native outputs and explicit projection markers planned.
