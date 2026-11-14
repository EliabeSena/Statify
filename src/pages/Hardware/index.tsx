import { useEffect, useState } from "react";
import { BsBatteryFull, BsCameraFill, BsDisplay, BsGpuCard, BsMemory } from "react-icons/bs";
import { IoMdFlash, IoMdFlashOff, IoMdMicrophone } from "react-icons/io";

import InfoCard from "../../components/InfoCard";
import TitleBar from "../../components/TitleBar";
import ProgressBar from "../../components/ProgressBar";
import InfoTag from "../../components/InfoTag";

import { DisplayContainer, MediaContainer, PageContainer } from "./styles";
import { getGPUInfo, getMediaDevices, measureRefreshRate } from "../../utils/getInfo";
import { type AvailableMedia } from "../../utils/getInfo"
import { formatEcho, formatFocusMode, formatOrientationName } from "../../utils/format";

function calculateTime(b: BatteryInfo): string {
	if(b.charging) {
		if(!Number.isFinite(b.chargingTime)) return "Calculando..."
		const minutes = Math.floor(b.chargingTime / 60)
		if(minutes == 0) return ""
		return `${minutes} Minutos`
	} else {
		if(!Number.isFinite(b.dischargingTime)) return "Calculando..."
		return `${Math.floor(b.dischargingTime / 60)} Minutos`
	}
}

function getInfoTag(s: boolean | undefined) {
	return (
		<InfoTag 
			color={s ? "var(--activeGreen)" : "var(--warningYellow)"}
			text={s ? "Disponível" : "Indisponível"}
		/>
	)
}

function calcDiagnosis(values: unknown[]): number {
  if (values.length === 0) return 100;

  const defined = values.filter((v) => v !== undefined && v !== null).length;
  return Math.round((defined / values.length) * 100);
}

interface MediaInfo {
	label: string;
	settings: MediaTrackSettings;
}

export function Hardware() {
	const gpuInfo = getGPUInfo()
	const [battery, setBattery] = useState<BatteryInfo>()
	const [freeStorage, setFreeStorage] = useState<number>()
	const [refreshRate, setRefreshRate] = useState<number>()
	const [mediaDevices, setMediaDevices] = useState<AvailableMedia>()
	const [camera, setCamera] = useState<MediaInfo>()
	const [microphone, setMicrophone] = useState<MediaInfo>()

	async function getMediaData(type: string) {
		try {
			const stream = await navigator.mediaDevices.getUserMedia(
				type === "camera" ? { video: true } : { audio: true }
			);

			const track = stream.getTracks()[0];
			const settings = track.getSettings();
			stream.getTracks().forEach((t) => t.stop());
			console.log(settings);

			(type === "camera" ? setCamera : setMicrophone)({label: track.label, settings });
		} catch (err) {
			// Talvez botar um aviso para o usuário em algum lugar depois, mas acho dificil dar erro
			console.error(err)
		}
	}

	useEffect(() => {
		if(!navigator.getBattery) return;
		let batteryManager: BatteryInfo | undefined;

		function readBattery() {
			if(!batteryManager) return

			setBattery({
				charging: batteryManager.charging, 
				chargingTime: batteryManager.chargingTime,
				dischargingTime: batteryManager.dischargingTime,
				level: batteryManager.level
			})
		}	

		navigator.getBattery().then((b: BatteryInfo) => {
			batteryManager = b
			readBattery()
		})

		const id = setInterval(() => readBattery(), 3000);
		return () => clearInterval(id);
	}, [])

	useEffect(() => {
		navigator.storage.estimate().then(({ quota = 0 }) => {
			setFreeStorage(quota / (1024 ** 3));
		});
	}, []);

	useEffect(() => {
  	measureRefreshRate().then(setRefreshRate);
	}, []);

	useEffect(() => {
		getMediaDevices().then(setMediaDevices)
	}, [])

	const diagnosisValues = [
		gpuInfo?.gpu, gpuInfo?.api, navigator.hardwareConcurrency,
		battery?.level, navigator.deviceMemory, freeStorage,

		screen.width,screen.height,window.devicePixelRatio,
		screen.orientation?.type, refreshRate,

		camera?.label, camera?.settings.width, camera?.settings.height,
		camera?.settings.frameRate, camera?.settings.focusMode, camera?.settings.facingMode,
		camera?.settings.exposureMode, camera?.settings.whiteBalanceMode, camera?.settings.torch,

		// Microfone 
		microphone?.label, microphone?.settings.channelCount, microphone?.settings.sampleRate,
		microphone?.settings.sampleSize, microphone?.settings.echoCancellation,
		microphone?.settings.autoGainControl, microphone?.settings.noiseSuppression,
		microphone?.settings.latency, microphone?.settings.voiceIsolation,
	]

	return (
		<PageContainer>
			<TitleBar diagnosis={calcDiagnosis(diagnosisValues)} 
				subtitle="RECURSOS DETECTADOS" title="Informações de Hardware"
			/>
			<div className="infoCardContainer">
				<InfoCard Icon={BsGpuCard} title="Placa Gráfica / Processador">
					<div className="simpleInfoContainer">
						<h1>{gpuInfo.gpu}</h1>
						<p style={{marginBottom: "1rem"}}>API Gráfica: {gpuInfo.api}</p>
						<h4>Quantidade de Núcleos: { navigator.hardwareConcurrency }</h4>
					</div>
				</InfoCard>
				<InfoCard Icon={BsBatteryFull} title="Energia">
					<div className="energyContainer">
						{battery == undefined ? 
						(<h1 style={{textAlign: "center"}}>Indisponível</h1>) : (
							<>
								<h1>{battery.charging ? "Carregando" : "Descarregando"}</h1>
								<ProgressBar 
									percentage={Math.round(battery.level * 100)} 
									color="#F5BA26"
									title={calculateTime(battery)}
									percentageStyle={{
										text: `${Math.round(battery.level * 100)}%`, isBig: true, 
										Icon: battery.charging ? IoMdFlash : IoMdFlashOff
									}}
								/>
							</>
						)}
					</div>
				</InfoCard>
			</div>
			<div className="infoCardContainer">
				<InfoCard title="Memória" Icon={BsMemory}>
					<div className="simplesInfoContainer">
						<h1>
							Memória RAM: {navigator.deviceMemory ? `${navigator.deviceMemory} GB` : "Indisponível"}
						</h1>
						<h1>
							Memória Livre Estimada: 
							{freeStorage ? ` ${freeStorage.toFixed(1)} GB` : "Desconhecido"}
						</h1>
					</div>
				</InfoCard>
				<InfoCard title="Monitor" Icon={BsDisplay}>
					<DisplayContainer>
						<h1 style={{textAlign: "center"}}>
							{screen.width * window.devicePixelRatio}
							<br />
							X
							<br />
							{screen.height * window.devicePixelRatio}				
						</h1>
						<div className="screenData">
							<span>
								<h5>ESCALA</h5>
								<p>{window.devicePixelRatio * 100}%</p>
							</span>
							<span>
								<h5>POSSUI HDR</h5>
								<p>{matchMedia("(dynamic-range: high)").matches ? "Sim" : "Não"}</p>
							</span>
						</div>
						<div className="screenData">
							<span>
								<h5>ORIENTAÇÃO</h5>
								<p>{formatOrientationName(screen.orientation.type)}</p>
							</span>
							<span>
								<h5>TAXA DE ATUALIZAÇÃO</h5>
								<p>{refreshRate ? `${refreshRate}Hz` : "Calculando..."}</p>
							</span>
						</div>
					</DisplayContainer>
				</InfoCard>
			</div>
			<div className="infoCardContainer">
				<InfoCard Icon={BsCameraFill} title="Câmera" InfoTag={getInfoTag(mediaDevices?.camera)}>
					{!camera ? (
						<div className="buttonContainer">
							<button className="permissionButton" onClick={() => getMediaData("camera")}>
								Solicitar Permissão
							</button>
						</div>
					) : (
						<MediaContainer>
							<span>
								<h1>Nome</h1>
								<p>{camera.label}</p>
							</span>
							<span>
								<h1>Resolução</h1>
								<p>
									{camera.settings.width ?? "??"} {" x "}
									{camera.settings.height ?? "??"}
								</p>
							</span>
							<span>
								<h1>Taxa de Quadros</h1>
								<p>{camera.settings.frameRate ?? "??"}Fps</p>
							</span>
							<span>
								<h1>Modo de Foco</h1>
								<p>{formatFocusMode(camera.settings.focusMode)}</p>
							</span>
							<span>
								<h1>Posição</h1>
								<p>{formatFocusMode(camera.settings.facingMode)}</p>
							</span>
							<span>
								<h1>Modo de Exposição</h1>
								<p>{formatFocusMode(camera.settings.exposureMode)}</p>
							</span>
							<span>
								<h1>Balanço de Branco</h1>
								<p>{formatFocusMode(camera.settings.whiteBalanceMode)}</p>
							</span>
							<span>
								<h1>Possui Lanterna</h1>
								<p>{camera.settings.torch == undefined ? "Não" : "Sim"}</p>
							</span>
						</MediaContainer>
					)}
				</InfoCard>
				<InfoCard 
					Icon={IoMdMicrophone} title="Microfone" 
					InfoTag={getInfoTag(mediaDevices?.microphone)}
				>
					{!microphone ? (
						<div className="buttonContainer">
							<button className="permissionButton" onClick={() => getMediaData("audio")}>
								Solicitar Permissão
							</button>
						</div>
					) : (
						<MediaContainer>
							<span>
								<h1>Nome</h1>
								<p>{microphone.label}</p>
							</span>
							<span>
								<h1>Tipo</h1>
								<p>
									{microphone.settings.channelCount ? 
									(microphone.settings.channelCount == 1 ? "Mono" : "Estereo") : "Desconhecido"}
								</p>
							</span>
							<span>
								<h1>Amostras</h1>
								<p>
									{microphone.settings.sampleRate ?? "?? "}Hz {" // "}
									{microphone.settings.sampleSize ?? "?? "}Bits
								</p>
							</span>
							<span>
								<h1>Cancelamento de Eco</h1>
								<p>{formatEcho(microphone.settings.echoCancellation)}</p>
							</span>
							<span>
								<h1>Ganho Automático</h1>
								<p>{microphone.settings.autoGainControl != undefined ? 
									(microphone.settings.autoGainControl ? "Sim" : "Não") : "Desconhecido"}
								</p>
							</span>
							<span>
								<h1>Cancelamento De Ruído</h1>
								<p>{microphone.settings.noiseSuppression != undefined ? 
									(microphone.settings.noiseSuppression ? "Sim" : "Não") : "Desconhecido"}
								</p>
							</span>
							<span>
								<h1>Latência</h1>
								<p>{microphone.settings.latency ?? "Desconhecido"}</p>
							</span>
							<span>
								<h1>Isolamento de Voz</h1>
								<p>{microphone.settings.voiceIsolation != undefined ? 
									(microphone.settings.voiceIsolation ? "Sim" : "Não") : "Desconhecido"}
								</p>
							</span>
						</MediaContainer>
					)}
				</InfoCard>
			</div>
		</PageContainer>
	)
}