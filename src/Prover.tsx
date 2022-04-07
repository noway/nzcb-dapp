import { useCallback, useContext, useEffect, useState } from "react";
import { plonk } from 'snarkjs'
import { getNZCPPubIdentity, getNZCPCircuitInput, PubIdentity, Proof, PublicSignals } from "./nzcpCircom";
import { RouteContext } from "./contexts";
import { EXAMPLE_WASM_FILE, EXAMPLE_ZKEY_FILE } from "./config";
import { CtaContainer } from "./styles";
import { PassInfo } from "./PassInfo";
import { Status, StatusError } from "./Status";

const real = true;

const proof = {
  A: [ "12505469721348144051130884511193801013223131584995462883951201970044178925367", "10541886471875629782652432198792013799291548884265244308562663634583858575745", "1" ],
  B: [ "19521933288960036766349567009154479348352695116597291089514184730624545695480", "5791406386982053922576230967036862904373103300473212610971472157403484303986", "1" ],
  C: [ "13888726123014572449476582321308298579676115061571923447734703277278648880612", "21315740284076643158734157808262865680761239336079105597755643996251282022198", "1" ],
  T1: [ "5644371911879369806307448057693201773657559461805724193523732210846019314023", "11373890707834038469430912440649187157820331217740812008718483074566950624113", "1" ],
  T2: [ "4595908950333689416823025858535261190573273369946065736073417145748705099440", "20160108543781037427779732492136386137924001526701734956281067092321951998364", "1" ],
  T3: [ "4762763357841614270344426536732644781406858897855959459224667811673133900688", "9979660328592677072676194888688998197156311445096349568900956901383295136671", "1" ],
  Wxi: [ "14586186017243251868007417059324101417130124503946779876416271950493432688687", "7937839675737986804404172167077234206147839596721454224036055555091484070534", "1" ],
  Wxiw: [ "20932126355298849896726735100612754593441099726194354022859114885256234142437", "6778118726526990801123739634892673323058565239959726923014998524770424337449", "1" ],
  Z: [ "21800083215254705277263447850947599241493376545826631584145272356590304113717", "16953186756423000294267878534139583964707067422951365976636298253232359141702", "1" ],
  curve: "bn128",
  eval_a: "15975345363576017614891663591385800553179042942493204930608651600851470268673",
  eval_b: "6658515438045478579654750454996993039164439200882277601458739332142435440598",
  eval_c: "6249022195907862239930386220092192632605412263467319260734409914992034498305",
  eval_r: "224637209515033972999313566724461856870756510058316924774702141863518479743",
  eval_s1: "240951975088030530434168810996617305673692058508298411825954900215476213036",
  eval_s2: "5882682009029320150008434636588893335849855835330178036103096864391007265553",
  eval_zw: "8285458462548585344865395618117846250137923939990720146396269771289771691001",
  protocol: "plonk",

}

const publicSignals = [
  "8464235439336389695359576364537904521787463454426143836621154307990710930",
  "334204042160295982690797293769892102755483197293558786265320143920457223185",
  "430989588176825940781496969207245773238692149205558489568811355968561479680",
] as const

const stub = { proof, publicSignals }

type Props = Readonly<{
  passURI: string
  address: string
}>;

export function Prover(props: Props) {
  const { passURI, address } = props
  const routeContext = useContext(RouteContext);
  const [proving, setProving] = useState(false);
  const [provingError, setProvingError] = useState<Error | null>(null);
  const [proof, setProof] = useState<Proof | null>(null);
  const [publicSignals, setPublicSignals] = useState<PublicSignals | null>(null);
  const [pubIdentity, setPubIdentity] = useState<PubIdentity | null>(null);

  const prove = useCallback(async function (passURI: string) {
    setProving(true)
    setProvingError(null)
    try {
      const pubIdentity = await getNZCPPubIdentity(passURI, address);
      setPubIdentity(pubIdentity)
      const circuitInput = getNZCPCircuitInput(passURI, address);

      let data;
      if (real) {
        console.time("fetch")
        const res = await fetch(EXAMPLE_ZKEY_FILE);
        const blob = await res.blob();
        console.log(blob)
        const zkeyurl = URL.createObjectURL(blob)
        console.log(zkeyurl)
        console.timeEnd("fetch")

        console.time("plonk")
        const realData = await plonk.fullProve(circuitInput, EXAMPLE_WASM_FILE, zkeyurl)
        console.log('realData',realData)
        console.timeEnd("plonk")

        data = realData
      }
      else {
        data = stub
      }

      const { proof, publicSignals } = data
      setProof(proof)
      setPublicSignals(publicSignals)
    }
    catch (e) {
      console.log((e as Error).stack)
      setProvingError(e as Error);
    }
    setProving(false);
  }, [address])

  useEffect(() => {
    prove(passURI)
  }, [passURI, prove])

  function proceed(proof: Proof, publicSignals: PublicSignals, pubIdentity: PubIdentity) {
    routeContext.navigate(["mint", { passURI, proof, publicSignals, pubIdentity }])
  }

  return (
    <div>
      <PassInfo passURI={passURI} />
      {proving ? <Status status="Proving, this may take a while..." /> : null}
      {provingError ? <StatusError error={provingError} /> : null}
      {proof && publicSignals && pubIdentity ? <Status status="Proof is ready" /> : null}
      <CtaContainer>
        {proof && publicSignals && pubIdentity ?
          <button type="button" onClick={() => proceed(proof, publicSignals, pubIdentity)} disabled={false}>Proceed</button> :
          <button type="button" disabled={true}>Proving...</button>}
      </CtaContainer>
    </div>
  );
}