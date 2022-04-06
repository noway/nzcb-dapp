import { useCallback, useContext, useEffect, useState } from "react";
import { plonk } from 'snarkjs'
import { getNZCPPubIdentity, getNZCPCircuitInput, PubIdentity, Proof, PublicSignals } from "./nzcpCircom";
import { RouteContext } from "./contexts";
import { EXAMPLE_WASM_FILE, EXAMPLE_ZKEY_FILE } from "./config";
import { CtaContainer } from "./styles";
import { PassInfo } from "./PassInfo";
import { Status, StatusError } from "./Status";

const proof = {
  A: [ "12301500420348015237989127501655055035372779750302270987147342222555086759939", "15292579464810555650793117706392018709443858103524672681034654061333245206316", "1" ],
  B: [ "21279242250413717797427806165942470217460219655608619004490900567656112689262", "2455534219468885351203168404358499835070460388944717361726259073228708352919", "1" ],
  C: [ "5652502229472769188919041956445602740786205811792699101332302424797227260858", "6808542571278526212022343074951934903869344058268306541421467636013134568547", "1" ],
  T1: [ "5615583803980074667618132356390956330876606827510131140814339351252353966811", "7292240745993842123763409308368184543623415359862364247720026295137084978750", "1" ],
  T2: [ "7390417253044512428892011542879042970075599761931137867492182770852281735489", "18497796266629507363923088881001472090435265354044789913929375898550322262937", "1" ],
  T3: [ "3759171649994050287434296447733336892181697644162853130891028489419314965823", "12192447835210512734968474375995195427941838926567300330694878076431003828709", "1" ],
  Wxi: [ "21620760285499152084947346013020637876882213230094593242816477603332243823874", "21647323270629922425575507663507778470524387493699344309046217936833093422203", "1" ],
  Wxiw: [ "17839803121499784375998760419749723358131045329175581393394660702002386202354", "1968594256255110911918233613427609143731784347836187428239052237251200619314", "1" ],
  Z: [ "810715332976229544324417454757525898602447364315294015352030971868319209619", "7901389141545618868443165861903570188939047143640094966986939488381523726694", "1" ],
  curve: "bn128",
  eval_a: "971227649332161653762212561512203466066327274083963712838006801315362572869",
  eval_b: "16404080671361490906877709656389811953287609819496943467819318444226613023825",
  eval_c: "10291281475897223313912421892194455812405013032651579325182222632154918785636",
  eval_r: "16746984554433595449126168185328076520196458015220561052931885282967987290174",
  eval_s1: "20496033646158393479944241770499756417173098978076127211880021299265145750674",
  eval_s2: "14828738507454410481447718363276773684750579879632606951940628782019499461679",
  eval_zw: "3262138870905915911159697754099524449199149217729564001659974308703196508763",
  protocol: "plonk",
} 
const publicSignals = [
  "8464235439336389695359576364537904521787463454426143836621154307990710930",
  "334204042160295982690797293769892102755483197293558786265320143920457223185",
  "430989588176825346791827322625404962104722513508263561834535300537883033600",
] as const

const stub = {proof, publicSignals}

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


      console.time("fetch")
      const res = await fetch(EXAMPLE_ZKEY_FILE);
      const blob = await res.blob();
      console.log(blob)
      const zkeyurl = URL.createObjectURL(blob)
      console.log(zkeyurl)
      console.timeEnd("fetch")

      console.time("plonk")
      const data = await plonk.fullProve(circuitInput, EXAMPLE_WASM_FILE, zkeyurl)
      console.log('data',data)
      console.timeEnd("plonk")

      // const data = stub

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