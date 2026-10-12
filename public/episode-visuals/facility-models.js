/* Educational mechanisms. All toy parameters are stated; no plant design or operating prescription. */
(() => {
  const M = window.DeepEndModels = window.DeepEndModels || {};
  const range = (key,label,min,max,step,value,unit='') => ({key,label,min,max,step,value,unit});
  const choice = (key,label,value,options) => ({key,label,type:'select',value,options:options.map(([value,label])=>({value,label}))});
  const source = (label,url) => ({label,url});
  const doe = source('DOE · thermodynamics and fluid flow','https://www.energy.gov/ehss/articles/doe-hdbk-10121-92');
  const separation = source('SLB · gravity separation','https://glossary.slb.com/Terms/s/separator');
  const hse = source('HSE · plant layout and interfaces','https://www.hse.gov.uk/comah/sragtech/techmeasplantlay.htm');
  const n = (v,d=2) => Number(v).toFixed(d);
  const define = (id,title,kind,controls,sources,compute) => {
    M[id] = {title,kind,controls,sources,draw(c,s){
      const r=compute(s);
      return {...r,svg:window.DeepEndMachines.draw(kind,c,{...s,...r.pose})};
    }};
  };
  define(47,'Current crosses a membrane; two gases leave separately','electrolyser',
    [range('current','Cell current',10,200,10,100,'A'),range('voltage','Cell voltage',1.5,2.5,.05,1.9,'V')],
    [source('DOE · electrolysis','https://www.energy.gov/cmei/fuels/hydrogen-production-electrolysis')],s=>{
      const mol=s.current/(2*96485.33212),kg=mol*2.01588e-3*3600,power=s.current*s.voltage;
      return {pose:{activity:s.current/200},readout:`H₂ ${n(kg,4)} kg/h · O₂ ${n(mol*1800,3)} mol/h · electrical input ${n(power,0)} W`,summary:'Ideal single PEM cell, 100% Faradaic efficiency. H₂ mol/s = I/(2F); O₂ production is half the H₂ molar rate. Input power = IV. Plates and gas paths are schematic; stack losses, gas crossover and balance of plant are excluded.'};
    });
  define(48,'Recycle gives unreacted gas another pass','ammonia',
    [range('conversion','Single-pass reactant conversion',5,30,1,15,'%'),range('passes','Passes through the converter',1,8,1,4)],
    [source('Topsoe · ammonia synthesis loop','https://www.topsoe.com/solutions/outputs/ammonia/synthesis')],s=>{
      const left=(1-s.conversion/100)**s.passes;
      return {pose:{activity:1-left,passes:s.passes},readout:`Cumulative reactant conversion ${n((1-left)*100,1)}% · ${n(left*100,1)}% remains`,summary:'Finite parcel example: each pass converts the same fraction of remaining reactants, then product is completely removed and unreacted gas returns. N₂ + 3H₂ ⇌ 2NH₃. No purge, inerts, equilibrium calculation, catalyst kinetics or actual loop yield is modeled.'};
    });
  define(49,'A silicon cell turns absorbed light into useful power','solar',
    [range('sun','Irradiance',100,1000,50,800,'W/m²'),range('temperature','Cell temperature',25,75,1,45,'°C')],
    [source('NLR · PVWatts temperature model','https://samrepo.nlr.gov/help/pvwatts_system_design.html')],s=>{
      const efficiency=.22*(1-.0035*(s.temperature-25)),power=2*s.sun*efficiency;
      return {pose:{activity:s.sun/1000,loss:(s.temperature-25)/50},readout:`Illustrative module output ${n(power,0)} W · efficiency ${n(efficiency*100,1)}%`,summary:'Toy 2 m² silicon module, reference efficiency 22% at 25°C, linear power-temperature coefficient −0.35%/°C. P = area × irradiance × efficiency. This isolates heat and light; it does not predict a particular PERC, TOPCon or HJT product, soiling or field degradation.'};
    });
  define(50,'Each equilibrium contact enriches the rising vapour','distillation',
    [range('alpha','Relative volatility',1,4,.1,2),range('contacts','Ideal equilibrium contacts',1,8,1,4)],
    [source('MIT · separation processes','https://ocw.mit.edu/courses/10-32-separation-processes-spring-2005/')],s=>{
      let x=.2;for(let i=0;i<s.contacts;i++)x=s.alpha*x/(1+(s.alpha-1)*x);
      return {pose:{activity:x,trays:s.contacts},readout:`Light-component mole fraction ${n(x,3)} · starts at 0.200`,summary:'Repeated ideal equilibrium enrichment: y = αx/[1+(α−1)x], starting x = 0.2 with constant α. Successive y becomes the next contact’s x. This explains contact enrichment; it is not a steady distillation column calculation and excludes reflux, material balances, flooding and azeotropes.'};
    });
  define(51,'The vessel turns around a mooring that stays put','turret',
    [range('heading','Vessel heading',0,330,15,60,'°')],
    [source('MODEC / SOFEC · turret and swivel systems','https://www.modec.com/business/mooring/mooring-systems.html')],s=>({pose:{angle:s.heading},readout:`Vessel heading ${s.heading}° · turret bearing and swivel share one axis`,summary:'Kinematic illustration of a turret-moored floating vessel weathervaning around a seabed-fixed mooring. The bearing allows relative rotation; the swivel transfers fluids across the rotating interface. Loads, mooring dynamics, seal leakage and drilling operations are not simulated.'}));
  define(52,'A handover lock needs every interface to match','handover',
    [range('checked','Interfaces checked',0,5,1,3)],
    [source('HSE · plant modification and change procedures','https://www.hse.gov.uk/comah/sragtech/techmeasplantmod.htm')],s=>({pose:{activity:s.checked/5},readout:`${s.checked}/5 illustrative interfaces matched · ${s.checked===5?'lock aligns':'mismatch remains'}`,summary:'A physical card-and-pin analogy for engineering handovers: matching five interface records aligns the lock. The count is an invented teaching example, not a commissioning checklist, risk assessment, approval or indication that a facility is safe.'}));
  define(53,'Wind changes which buildings lie downstream','layout',
    [range('wind','Direction toward which air moves',0,315,45,90,'°')],
    [hse],s=>({pose:{angle:s.wind},readout:`Air moves toward ${s.wind}° · the downwind corridor rotates`,summary:'A wind vane over a miniature plot plan illustrates why prevailing winds and occupied buildings belong in the design basis. The pale corridor is directional only. No gas concentration, radiation, hazardous-area boundary, separation distance or site-safety conclusion is calculated.'}));
  define(54,'A ring main can reach demand by two routes','firewater',
    [choice('route','Ring section','both',[['both','Both routes open'],['one','One section isolated']]),range('flow','Total demand',20,100,5,60,'L/s')],
    [source('HSE · fire and emergency systems','https://www.hse.gov.uk/pubns/books/l65.htm')],s=>{
      const branches=s.route==='one'?1:2,v=s.flow/1000/branches/(Math.PI*.15**2/4);
      return {pose:{activity:s.flow/100,branches},readout:`${branches} equal route${branches===1?'':'s'} · illustrative branch velocity ${n(v)} m/s`,summary:'Continuity example with one or two equal parallel 150 mm routes. Each active route takes Q/n; v = Q/(nA). Actual fire-water hydraulics need pump curves, friction, elevations and required residual pressures. No adequacy or fire-demand compliance is implied.'};
    });
  define(55,'Several relief sources share one header','flare',
    [range('trains','Identical relief sources',1,3,1,2),range('load','Flow per source',2,12,1,8,'kg/s')],
    [source('HSE · loss of containment and flare drums','https://www.hse.gov.uk/offshore/assets/docs/inspection-of-loss-of-containment.pdf')],s=>({pose:{activity:s.trains*s.load/36,trains:s.trains},readout:`Combined header mass flow ${s.trains*s.load} kg/s`,summary:'A schematic collection header sums identical simultaneous gas sources. Mass conservation gives total flow = source count × flow per source. Tip capacity, back pressure, flare destruction efficiency, radiation, dispersion and relief scenarios require separate engineering.'}));
  define(56,'The slug catcher turns a surge into stored inventory','slugcatcher',
    [range('slug','Liquid slug volume',10,120,5,60,'m³'),range('time','Drain time after arrival',0,10,.5,3,'min')],
    [source('SLB · slug tracking and slug-catcher capacity','https://www.slb.com/products-and-services/delivering-digital-at-scale/software/olga/olga-pipeline-management/olga-slug-tracking')],s=>{
      const stored=Math.max(0,s.slug-4*s.time);
      return {pose:{activity:stored/120},readout:`Stored liquid ${n(stored,0)} m³ · available toy capacity ${n(120-stored,0)} m³`,summary:'An instantaneous slug into an initially empty 120 m³ buffer, drained at constant 4 m³/min with no continuing inflow. V = max(0, Vslug − qout t). Finger liquid levels show this inventory. Actual severe slugging, gas disengagement and overfill protection are excluded.'};
    });
  define(57,'Droplet size decides how long gravity needs','separator',
    [range('diameter','Water droplet diameter',10,80,5,40,'μm'),range('time','Settling time',0,120,5,60,'s')],
    [separation,source('EPA · oil/water separation and Stokes law','https://nepis.epa.gov/Exe/ZyPURL.cgi?Dockey=91017FMD.TXT')],s=>{
      const d=s.diameter*1e-6,v=200*9.80665*d*d/(18*.005),travel=v*s.time;
      return {pose:{activity:Math.min(1,travel/.02),diameter:s.diameter},readout:`Stokes velocity ${n(v*1000,3)} mm/s · travel ${n(travel*1000,1)} mm`,summary:'Isolated spherical water droplets in a quiescent oil phase: density difference 200 kg/m³, dynamic viscosity 5 mPa·s. v = Δρgd²/(18μ), valid for low Reynolds number. The drawing magnifies a 20 mm settling window; turbulence, coalescence, emulsions and separator capacity are excluded.'};
    });
  define(58,'Lean glycol takes water from rising gas','dehydration',
    [range('contacts','Idealized contact steps',1,8,1,4),range('fraction','Removal fraction per contact',10,50,5,25,'%')],
    [source('SLB · glycol dehydration','https://www.slb.com/products-and-services/innovating-in-oil-and-gas/well-production/processing-and-separation/gas-treatment/glycol-dehydration-systems')],s=>{
      const remaining=(1-s.fraction/100)**s.contacts;
      return {pose:{activity:1-remaining,trays:s.contacts},readout:`Normalized water remaining ${n(remaining*100,1)}%`,summary:'Illustrative countercurrent contactor, starting at 100 normalized water units and removing a fixed fraction at each contact. This geometric toy explains staged contact, not actual TEG equilibrium, purity, regeneration temperature or a calculated export dew point.'};
    });
  define(59,'Separate liquid before choosing the vapour route','knockout',
    [range('level','Drum liquid inventory',10,80,5,35,'%'),choice('recovery','Vapour recovery','running',[['running','Recovery running'],['tripped','Recovery tripped']])],
    [source('HSE · flare drum separation','https://www.hse.gov.uk/offshore/assets/docs/inspection-of-loss-of-containment.pdf')],s=>({pose:{activity:s.level/100,recovery:s.recovery==='running'},readout:`Liquid inventory ${s.level}% · vapour ${s.recovery==='running'?'recovery route highlighted':'flare route highlighted'}`,summary:'Conceptual knock-out drum with a demister, liquid space and two downstream vapour routes. The selector changes the highlighted teaching path after a recovery trip. This does not model relief logic, automatic valve positions, compressor control, carryover or safe operating limits.'}));
  define(60,'Compression trades shaft work for pressure','compressor',
    [range('ratio','Pressure ratio',1.2,5,.1,3),range('efficiency','Isentropic efficiency',50,90,5,75,'%')],
    [doe],s=>{
      const ideal=300*(s.ratio**(.4/1.4)-1),actual=ideal/(s.efficiency/100),work=1.005*actual;
      return {pose:{activity:(s.ratio-1.2)/3.8},readout:`Outlet ${n(300+actual,0)} K · shaft work ${n(work,1)} kJ/kg`,summary:'Ideal-gas air compressor, inlet 300 K, γ = 1.4 and cp = 1.005 kJ/(kg·K). Isentropic temperature rise divided by efficiency gives actual rise; work = cpΔT. No real-gas map, speed, staging, intercooling, anti-surge margin or natural-gas performance is claimed.'};
    });
  define(61,'Independent barriers need separate evidence','barriers',
    [choice('evidence','Illustrative evidence state','both',[['both','Both independently verified'],['one','One unverified'],['shared','Shared dependency exposed']])],
    [source('HSE · safe isolation of plant','https://www.hse.gov.uk/pubns/priced/hsg253.pdf')],s=>({pose:{barriers:s.evidence==='both'?2:1,shared:s.evidence==='shared'},readout:s.evidence==='both'?'Two separate evidence paths shown':s.evidence==='one'?'Second barrier evidence is missing':'One shared dependency can affect both barriers',summary:'A teaching model of two barrier gates and their evidence pins. A shared pin depicts common dependence during simultaneous operations. No valve lineup, well-control instructions, isolation certificate or assurance that an actual task can proceed is provided.'}));
  define(62,'A spinning stream magnifies density separation','hydrocyclone',
    [range('velocity','Tangential velocity',2,10,.5,5,'m/s'),range('radius','Illustrative swirl radius',30,100,5,50,'mm')],
    [source('SLB · produced-water treatment','https://www.slb.com/products-and-services/innovating-in-oil-and-gas/well-production/processing-and-separation/produced-water-treatment')],s=>{
      const accel=s.velocity**2/(s.radius/1000);
      return {pose:{activity:s.velocity/10},readout:`Centripetal acceleration ${n(accel,0)} m/s² · ${n(accel/9.80665,1)} g`,summary:'At a chosen swirl radius, a = v²/r. Lighter oil tends toward the core and denser water toward the wall in a deoiling cyclone. Flow topology is schematic; this local acceleration does not calculate separation efficiency, droplet cut size, pressure drop or discharge quality.'};
    });
  define(63,'Receiver volume buys time when the supply stops','airreceiver',
    [range('volume','Receiver volume',1,10,.5,4,'m³'),range('demand','Free-air demand',1,10,.5,3,'m³/min')],
    [source('Atlas Copco · air receiver storage','https://www.atlascopco.com/en-eg/compressors/wiki/compressed-air-articles/what-is-an-air-receiver')],s=>{
      const free=s.volume*(9-6),minutes=free/s.demand;
      return {pose:{activity:s.volume/10},readout:`Usable free-air equivalent ${n(free,1)} m³ · ideal buffer ${n(minutes,1)} min`,summary:'Isothermal ideal-gas receiver falling from 9 to 6 bar absolute, with free air referenced to 1 bar at the same temperature. Usable volume = V(Pstart−Pend)/Pref. Constant demand, no leaks or compressor supply. Air purity, dryer performance and emergency utility adequacy are excluded.'};
    });
  define(64,'Thin films let dissolved oxygen escape','deaerator',
    [range('contacts','Contact-time multiples',0,5,.25,2),range('equilibrium','Equilibrium oxygen floor',0,2,.1,.5,'mg/L')],
    [source('Alfa Laval · vacuum water deaeration','https://assets.alfalaval.com/documents/pd4d525bc/alfa-laval-product-leaflet-alrox-en.pdf')],s=>{
      const out=s.equilibrium+(8-s.equilibrium)*Math.exp(-s.contacts);
      return {pose:{activity:1-out/8},readout:`Illustrative dissolved oxygen ${n(out,2)} mg/L`,summary:'First-order mass-transfer illustration: C = C* + (C₀−C*) exp(−kLa t), with C₀ = 8 mg/L. The slider is dimensionless kLa t; the floor is user-selected, not a vacuum-pressure calculation. This shows the mechanism, not seawater chemistry or injection-water compliance.'};
    });
  define(65,'A blocked screen squeezes flow into less area','intake',
    [range('blocked','Screen area blocked',0,75,5,25,'%'),range('flow','Water flow',.5,3,.1,1.5,'m³/s')],
    [source('EPA · cooling-water intake screens','https://www.epa.gov/cooling-water-intakes')],s=>{
      const area=10*(1-s.blocked/100),v=s.flow/area;
      return {pose:{activity:s.blocked/100},readout:`Open area ${n(area,1)} m² · through-screen velocity ${n(v,3)} m/s`,summary:'Uniform continuity model: 10 m² initially open screen area, reduced by blockage, at imposed constant Q. v = Q/Aopen. Actual pump flow changes with head loss. This does not calculate vortices, pump submergence, fish impingement or a regulatory pass/fail threshold.'};
    });
  define(66,'Stored diesel becomes operating hours','diesel',
    [range('fuel','Day-tank fuel',100,1000,50,600,'L'),range('burn','Constant consumption',10,100,5,40,'L/h')],
    [source('Cummins · generator fuel-system fundamentals','https://www.cummins.com/sites/default/files/rv-manuals/0981-0627.pdf')],s=>{
      const usable=s.fuel*.85;
      return {pose:{activity:s.fuel/1000},readout:`Illustrative usable fuel ${n(usable,0)} L · autonomy ${n(usable/s.burn,1)} h`,summary:'Toy constant-consumption day tank with 15% of its indicated volume reserved or unusable. Duration = usable litres / litres per hour. Actual load-dependent consumption, transfer pumps, contamination, filtration, testing and emergency reserve requirements are excluded.'};
    });
  define(67,'Contact time lets biology remove biodegradable load','effluent',
    [range('time','Hydraulic residence time',1,12,.5,6,'h'),range('rate','Toy removal rate',.05,.4,.025,.2,'1/h')],
    [source('EPA · biological wastewater treatment','https://nepis.epa.gov/Exe/ZyPURL.cgi?Dockey=9100NX8X.TXT'),source('MIT · first-order stirred reactor','https://ocw.mit.edu/courses/10-37-chemical-and-biological-reaction-engineering-spring-2007/resources/lec05_02212007_g/')],s=>{
      const residual=300/(1+s.rate*s.time);
      return {pose:{activity:1-residual/300},readout:`Toy biodegradable concentration ${n(residual,0)} mg/L · removal ${n((1-residual/300)*100,1)}%`,summary:'Steady, completely mixed reactor with first-order removal: Cout = Cin/(1+kτ), Cin = 300 mg/L. This explains residence time in a basin, not full activated-sludge kinetics, oxygen demand, sludge age, toxic loads, measured COD or discharge compliance.'};
    });
  define(68,'The cold end asks more of every unit of shaft work','lng',
    [range('cold','Cold-side temperature',110,180,5,110,'K'),range('ambient','Ambient heat-rejection temperature',290,320,5,300,'K')],
    [doe,source('Linde · LNG liquefaction and heat exchangers','https://www.linde-engineering.com/products-and-services/process-plants/natural-gas-processing/small-to-mid-scale-lng-plants')],s=>{
      const cop=s.cold/(s.ambient-s.cold),work=100/cop;
      return {pose:{activity:(180-s.cold)/70},readout:`Ideal Carnot COP ${n(cop,3)} · minimum work ${n(work,1)} kW per 100 kW cooling`,summary:'Reversible refrigeration between two fixed temperatures: COP = Tc/(Th−Tc), using kelvin. A colder cold side needs more work for the same cooling duty. The coil-wound cutaway is schematic. Actual LNG has changing temperatures, composition and phase; this bound is not train specific power.'};
    });
})();
