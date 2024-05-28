import React from "react";
import useResponsive from "../hook/useResponsive";
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Input, Card, Row, Tag, Popconfirm, notification } from "antd";
import {
  OpenAIFilled,
  ThunderboltOutlined,
  EditOutlined,
  CloseOutlined,
  SlackOutlined,
  SendOutlined,
  BulbOutlined,
  AudioOutlined,
  LogoutOutlined,
  LeftCircleOutlined,
} from "@ant-design/icons";
import Http from "../utils/http";
import styled from "styled-components";
import axios from "axios";
import { useMemoAsync } from "@chengsokdara/react-hooks-async";
import { openNotification } from "../utils/notification";
import {
  defaultStopTimeout,
  ffmpegCoreUrl,
  silenceRemoveCommand,
  whisperApiEndpoint,
  rasaApiEndpoint,
} from "./chatConfig";
import "./chat.css";
import { getUserId } from "../utils/auth";
import { logout } from "../utils/auth";
/**
 * default useWhisper configuration
 */
const StyledCard = styled.div`
  border-width: 2px;
  background: #1034e663;
  border: 2px solid hsla(0, 0%, 100%, 0.7);
  width: 80%;
  maxwidth: 600px;
  height: 80%;
  border-radius: 20px;
  border: none;
  overflow-y: auto;
  padding: 20px;
`;

const defaultConfig = {
  apiKey: `${process.env.OPEN_API_KEY}`,
  autoTranscribe: true,
  mode: "transcriptions",
  nonStop: true,
  removeSilence: false,
  stopTimeout: defaultStopTimeout,
  streaming: false,
  timeSlice: 1_000,
  onDataAvailable: undefined,
  onTranscribe: undefined,
};

const defaultTimeout = {
  stop: undefined,
};

// Default voice setting for text-to-speech
const inputVoice = "nova"; // https://platform.openai.com/docs/guides/text-to-speech/voice-options
const inputModel = "tts-1"; // https://platform.openai.com/docs/guides/text-to-speech/audio-quality

const VoiceChabot = () => {
  const navigate = useNavigate();
  const chunks = useRef([]);
  const id = useParams();
  const encoder = useRef();
  const listener = useRef();
  const conversatinRef = useRef("60vh");
  const timeout = useRef(defaultTimeout);
  const recorder = useRef();
  const stream = useRef();
  const { isMobile, isTablet } = useResponsive();
  const [flag, setFlag] = useState(false);
  const [endFlag, setEndFlag] = useState(false);
  const [icon, setIcon] = useState(<AudioOutlined />); // set initial voice button
  const [speaking, setSpeaking] = useState(false);
  const [recordFlag, setRecordFlag] = useState(false);
  const [userFlag, setUserFlag] = useState(false);
  const [botFlag, setBotFlag] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [messages, setMessages] = useState([]);
  const [initialValue, setInitialValue] = useState("");
  const [inputFlag, setInputFlag] = useState(false);
  const [conversationList, setConversationList] = useState([]);
  const [inputIcon, setInputIcon] = useState(<EditOutlined />);
  const [guessFlag, setGuessFlag] = useState(false);
  const [guessIcon, setGuessIcon] = useState(<BulbOutlined />);
  const [countflag, setCountFlag] = useState(0);
  const [historyCreated, setHistoryCreated] = useState(false);
  const [guessList, setGuessList] = useState([
    <Tag
      color="geekblue"
      style={{
        overflowWrap: "break-word",
        lineHeight: "1.2",
        maxHeight: "3.6em",
        fontSize: "1rem",
        wordWrap: "break-word",
        whiteSpace: "pre-wrap",
      }}
      onClick={async (e) => {
        SetEndCov(endCov + 1);
        setGuessFlag(false);
        await connectRasa(e.target.innerText, "suggest");
      }}
    >
      I believe in you, and I know you'll make the right choice.
    </Tag>,
    <Tag
      color="geekblue"
      style={{
        overflowWrap: "break-word",
        lineHeight: "1.2",
        maxHeight: "3.6em",
        fontSize: "1rem",
        wordWrap: "break-word",
        whiteSpace: "pre-wrap",
      }}
      onClick={async (e) => {
        SetEndCov(endCov + 1);
        setGuessFlag(false);
        await connectRasa(e.target.innerText, "suggest");
      }}
    >
      Think about what you want from your next job, then work from there.
    </Tag>,
  ]);
  const [endCov, SetEndCov] = useState(0);
  const [question, setQuestion] = useState({
    title: "Talk about your self",
    task1: "say something your self",
    task2: "Say why you are good fit for the role",
  });
  const sync_DB = async (role, type, content) => {
    if (role) SetEndCov(endCov + 1);
    const user_id = await getUserId();
    Http.post("/cov/createList", {
      user_id: user_id._id,
      role,
      content,
      type,
      topic: id.id,
    }).then((result) => {});
  };

  const connectRasa = async (text, type) => {
    setConversationList((prevList) => [
      ...prevList,
      rightM(text, prevList.length + 1),
    ]);
    await sync_DB(true, type, text);
    await axios
      .post(rasaApiEndpoint, {
        sender: "rasa",
        message: text,
      })
      .then(async (response) => {
        await playAudio(response.data[0].text);
        setConversationList((prevList) => [
          ...prevList,
          leftM(response.data[0].text, prevList.length + 1),
        ]);
        await sync_DB(false, "speech", response.data[0].text);
      })
      .catch((err) => {
        openNotification("warning", "please check your network");
      });
  };
  const leftM = (m, key) => {
    return (
      <li className="other" key={key}>
        <div className="msg">
          {isMobile ? <p className="limit-line-mobile">{m}</p> : <p>{m}</p>}
        </div>
      </li>
    );
  };
  const rightM = (m, key) => {
    return (
      <li className="self" key={key}>
        <div className="msg">
          {isMobile ? <p className="limit-line-mobile">{m}</p> : <p>{m}</p>}
        </div>
      </li>
    );
  };
  const sendQuestion = (text) => {
    setMessages((messages) => [
      ...messages,
      { key: messages.length, isBot: false, data: text },
      { key: messages.length + 1, isBot: true, data: "..." },
    ]);
    setUserFlag(false);
    setBotFlag(true);
  };

  const startRecording = async () => {
    await onStartRecording();
  };

  useEffect(() => {
    if (inputFlag) setGuessFlag(flag);
    setInputIcon(inputFlag ? <CloseOutlined /> : <EditOutlined />);
  }, [inputFlag]);

  useEffect(() => {
    if (guessFlag) setInputFlag(flag);
    setGuessIcon(guessFlag ? <CloseOutlined /> : <BulbOutlined />);
  }, [guessFlag]);

  const {
    apiKey,
    autoTranscribe,
    mode,
    nonStop,
    removeSilence,
    stopTimeout,
    streaming,
    timeSlice,
    whisperConfig,
    onDataAvailable: onDataAvailableCallback,
    onTranscribe: onTranscribeCallback,
  } = {
    ...defaultConfig,
  };

  if (!apiKey && !onTranscribeCallback) {
    throw new Error("apiKey is required if onTranscribe is not provided");
  }

  useEffect(() => {
    (async () => {
      try {
        if (endFlag) {
          setRecordFlag(false);
          setUserFlag(false);
          setBotFlag(false);
          await stopRecording();
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, [endFlag]);

  useEffect(() => {
    if (conversatinRef.current) {
      conversatinRef.current.scrollTop = conversatinRef.current.scrollHeight;
    }
  }, [conversationList]);

  useEffect(() => {
    if (id.id) {
      Http.post("/task/getTaskList", id).then(async (result) => {
        if (result) {
          let topic = result.data.result;
          setQuestion({
            task1: topic.task1,
            task2: topic.task2,
            title: topic.title,
          });
          setConversationList([
            [
              leftM(
                `Topic is "${topic.title}" and let's talk about this!😃`,
                0
              ),
            ],
          ]);
          await sync_DB(false, "speech", topic.title);
        }
      });
    }
  }, [id]);

  // Function to convert text to speech and play it using Speaker
  const playAudio = async (inputText) => {
    const url = "https://api.openai.com/v1/audio/speech";
    const headers = {
      Authorization: `Bearer ${apiKey}`, // API key for authentication
    };

    const data = {
      model: inputModel,
      input: inputText,
      voice: inputVoice,
      response_format: "mp3",
    };

    try {
      // Make a POST request to the OpenAI audio API
      const response = await axios.post(url, data, {
        headers: headers,
        responseType: "blob",
      });
      const audioBlob = new Blob([response.data], { type: "audio/mp3" }); // Replace 'audio/mp3' with the correct type
      const audioUrl = URL.createObjectURL(audioBlob);

      const audio = new Audio(audioUrl);
      audio.addEventListener("loadeddata", () => {
        audio
          .play()
          .catch((error) => console.error("Error playing the audio", error));
      });
      audio.addEventListener("ended", async () => {
        await startRecording();
      });
    } catch (error) {
      // Handle errors from the API or the audio processing
      if (error.response) {
        console.error(
          `Error with HTTP request: ${error.response.status} - ${error.response.statusText}`
        );
      } else {
        console.error(`Error in streamedAudio: ${error.message}`);
      }
    }
  };

  useEffect(() => {
    console.log("endCov_status-----------", endCov);
    (async () => {
      try {
        if (endCov == 9) {
          const user_id = await getUserId();
          await Http.post("/mark/scoring", {
            user_id: user_id._id,
            topic: id.id,
          }).catch((err) => {
            console.log("error", err);
          });
          navigate(`/mark/${id.id}`);
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, [endCov]);

  const onStopRecording = async () => {
    try {
      if (recorder.current) {
        const recordState = await recorder.current.getState();
        if (recordState === "recording" || recordState === "paused") {
          await recorder.current.stopRecording();
        }
        onStopStreaming();
        onStopTimeout("stop");
        if (autoTranscribe) {
          await onTranscribing();
        } else {
        }
        await recorder.current.destroy();
        chunks.current = [];
        if (encoder.current) {
          encoder.current.flush();
          encoder.current = undefined;
        }
        recorder.current = undefined;
      }
    } catch (err) {
      console.error(err);
    }
  };

  const stopRecording = async () => {
    await onStopRecording();
  };

  const onStartRecording = async () => {
    try {
      if (!stream.current) {
        await onStartStreaming();
      }
      if (stream.current) {
        if (!recorder.current) {
          const {
            default: { RecordRTCPromisesHandler, StereoAudioRecorder },
          } = await import("recordrtc");
          const recorderConfig = {
            mimeType: "audio/wav",
            numberOfAudioChannels: 1, // mono
            recorderType: StereoAudioRecorder,
            sampleRate: 44100, // Sample rate = 44.1khz
            timeSlice: streaming ? timeSlice : undefined,
            type: "audio",
            ondataavailable: undefined,
          };
          recorder.current = new RecordRTCPromisesHandler(
            stream.current,
            recorderConfig
          );
        }
        if (!encoder.current) {
          const { Mp3Encoder } = await import("lamejs");
          encoder.current = new Mp3Encoder(1, 44100, 96);
        }
        const recordState = await recorder.current.getState();
        console.log(" recordState, nonStop:", recordState, nonStop);
        if (recordState === "inactive" || recordState === "stopped") {
          await recorder.current.startRecording();
        }
        if (recordState === "paused") {
          await recorder.current.resumeRecording();
        }
        if (nonStop) {
          // onStartTimeout("stop");
        }
        // setRecording(true);
      }
    } catch (err) {
      console.error(err);
    }
  };
  const handleAudio = async () => {
    if (!recordFlag) {
      setRecordFlag(true);
      setUserFlag(true);
      await startRecording();
    }
  };

  const onStartSpeaking = () => {
    console.log("start speaking");
    setSpeaking(true);
    onStopTimeout("stop");
  };

  const onStartStreaming = async () => {
    try {
      if (stream.current) {
        stream.current.getTracks().forEach((track) => track.stop());
      }
      stream.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      if (!listener.current) {
        const { default: hark } = await import("hark");
        listener.current = hark(stream.current, {
          interval: 100,
          play: false,
        });
        listener.current.on("speaking", onStartSpeaking);
        listener.current.on("stopped_speaking", onStopSpeaking);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onStopStreaming = () => {
    if (listener.current) {
      listener.current.off("speaking", onStartSpeaking);
      listener.current.off("stopped_speaking", onStopSpeaking);
      listener.current = undefined;
    }
    if (stream.current) {
      stream.current.getTracks().forEach((track) => track.stop());
      stream.current = undefined;
    }
  };

  const onStopTimeout = (type) => {
    if (timeout.current[type]) {
      clearTimeout(timeout.current[type]);
      timeout.current[type] = undefined;
    }
  };

  const onTranscribing = async () => {
    console.log("transcribing speech");
    try {
      if (encoder.current && recorder.current) {
        const recordState = await recorder.current.getState();
        if (recordState === "stopped") {
          let blob = await recorder.current.getBlob();
          if (removeSilence) {
            const { createFFmpeg } = await import("@ffmpeg/ffmpeg");
            const ffmpeg = createFFmpeg({
              mainName: "main",
              corePath: ffmpegCoreUrl,
              log: true,
            });
            if (!ffmpeg.isLoaded()) {
              await ffmpeg.load();
            }
            const buffer = await blob.arrayBuffer();
            console.log({ in: buffer.byteLength });
            ffmpeg.FS("writeFile", "in.wav", new Uint8Array(buffer));
            await ffmpeg.run(
              "-i", // Input
              "in.wav",
              "-acodec", // Audio codec
              "libmp3lame",
              "-b:a", // Audio bitrate
              "96k",
              "-ar", // Audio sample rate
              "44100",
              "-af", // Audio filter = remove silence from start to end with 2 seconds in between
              silenceRemoveCommand,
              "out.mp3" // Output
            );
            const out = ffmpeg.FS("readFile", "out.mp3");
            console.log({ out: out.buffer.byteLength });
            // 225 seems to be empty mp3 file
            if (out.length <= 225) {
              ffmpeg.exit();
              return;
            }
            blob = new Blob([out.buffer], { type: "audio/mpeg" });
            ffmpeg.exit();
          } else {
            const buffer = await blob.arrayBuffer();
            console.log({ wav: buffer.byteLength });
            const mp3 = encoder.current.encodeBuffer(new Int16Array(buffer));
            blob = new Blob([mp3], { type: "audio/mpeg" });
            console.log({ blob, mp3: mp3.byteLength });
          }
          if (typeof onTranscribeCallback === "function") {
            const transcribed = await onTranscribeCallback(blob);
            console.log("onTranscribe", transcribed);
          } else {
            const file = new File([blob], "speech.mp3", { type: "audio/mpeg" });
            const text = await onWhispered(file);
            setTranscript(text);
            await connectRasa(text, "speech");
            SetEndCov(endCov + 1);
            console.log("endCov", endCov);
            setEndFlag(false);
            sendQuestion(text);
          }
        }
      }
    } catch (err) {
      console.info(err);
    }
  };

  const onWhispered = useMemoAsync(
    async (file) => {
      const body = new FormData();
      body.append("file", file);
      body.append("model", "whisper-1");
      if (mode === "transcriptions") {
        body.append("language", whisperConfig?.language ?? "en");
      }
      if (whisperConfig?.prompt) {
        body.append("prompt", whisperConfig.prompt);
      }
      if (whisperConfig?.response_format) {
        body.append("response_format", whisperConfig.response_format);
      }
      if (whisperConfig?.temperature) {
        body.append("temperature", `${whisperConfig.temperature}`);
      }
      const headers = {};
      headers["Content-Type"] = "multipart/form-data";
      if (apiKey) {
        headers["Authorization"] = `Bearer ${apiKey}`;
      }
      const { default: axios } = await import("axios");
      const response = await axios.post(whisperApiEndpoint + mode, body, {
        headers,
      });
      return response.data.text;
    },
    [apiKey, mode, whisperConfig]
  );

  const onStopSpeaking = () => {
    console.log("stop speaking");
    setSpeaking(false);
    if (nonStop) {
    }
  };
  useEffect(() => {
    if (flag) {
      //stop
      console.log("here we will stop recording");
      setIcon(<SlackOutlined />);
      handleAudio();
    } else {
      //start
      console.log("here we will start recording");
      setIcon(<AudioOutlined />);
    }
  }, [flag]);
  return (
    <>
      <div className="header">
        <Row justify="space-between">
          <LeftCircleOutlined
            onClick={() => navigate(`/topic/${id.id}`)}
            style={{ fontSize: "25px", marginLeft: "10px" }}
          />
          <LogoutOutlined
            onClick={() => {
              logout();
              navigate("/");
            }}
            style={{ fontSize: "25px", marginRight: "10px" }}
          />
        </Row>
      </div>

      <div
        style={{
          position: "absolute",
          top: "9vh",
          backgroundImage: `url('../assets/days/Day${id.id}.png')`,
          borderRadius: "20px",
          backgroundSize: "cover",
          width: "90%",
          height: "70%",
        }}
      >
        <StyledCard
          style={{
            width: "100%",
            height: "100%",
            padding: "0px",
            background: "#61dafb6e",
          }}
        >
          <ol className="chat" id="list" ref={conversatinRef}>
            {conversationList}
          </ol>
        </StyledCard>
      </div>
      <>
        {endCov >= 6 ? (
          <Button
            icon={<SendOutlined />}
            id="End Conversation"
            style={{
              position: "absolute",
              right: "10px",
              bottom: "120px",
              fontSize: "1rem",
              color: "white",
              background: "#9053c7",
            }}
            onClick={async () => {
              const user_id = await getUserId();
              await Http.post("/mark/scoring", {
                user_id: user_id._id,
                topic: id.id,
              }).catch((err) => {
                console.log("error", err);
              });
              navigate(`/mark/${id.id}`);
            }}
          >
            End Conversation
          </Button>
        ) : (
          <></>
        )}
      </>

      <div
        style={{
          position: "absolute",
          bottom: "0px",
          background: "#1034e663",
          width: "100%",
          borderRadius: "70px 70px 0px 0px",
          height: "12vh",
        }}
      >
        <div
          id="toolBar"
          style={{
            width: "100%",
            display: "flex",
            position: "absolute",
            bottom: "20px",
            flexDirection: "row",
            flexWrap: "nowrap",
            justifyContent: "space-around",
          }}
        >
          {!inputFlag ? (
            <EditOutlined
              style={{ fontSize: "20px" }}
              onClick={() => {
                setInputFlag(!inputFlag);
              }}
            />
          ) : (
            <CloseOutlined
              style={{ fontSize: "20px" }}
              onClick={() => {
                setInputFlag(!inputFlag);
              }}
            />
          )}

          <div
            onClick={() => {
              if (flag) setEndFlag(true);
              setFlag(flag ? false : true);
            }}
            style={{ fontSize: "40px" }}
          >
            {!flag ? (
              <AudioOutlined style={{ fontSize: "40px" }} />
            ) : (
              <SlackOutlined style={{ fontSize: "40px" }} />
            )}
          </div>
          <BulbOutlined
            style={{ fontSize: "20px" }}
            onClick={() => {
              setGuessFlag(!guessFlag);
            }}
          />
        </div>
        <>
          {inputFlag ? (
            <div>
              <Input
                placeholder="Input you want to say.."
                className="custom-placeholder"
                style={{
                  width: "90%",
                  margin: "5px",
                  fontSize: "1rem",
                  background: "#9053C700",
                  borderColor: "#9053C700 #9053C700 #890bf9 #9053C700",
                  color: "#ffff",
                  borderWidth: "5px",
                  marginTop: "-11px",
                }}
                onChange={(e) => {
                  setInitialValue(e.target.value);
                }}
                onPressEnter={async (e) => {
                  setInitialValue("");
                  await connectRasa(e.target.value, "input");
                }}
                value={initialValue}
              />
            </div>
          ) : (
            <></>
          )}
        </>
        <>
          {guessFlag ? (
            <div
              style={{
                overflow: "auto",
                display: "flex",
              }}
            >
              <Tag
                color="geekblue"
                style={{
                  overflowWrap: "break-word",
                  lineHeight: "1.2",
                  maxHeight: "3.6em",
                  fontSize: "1rem",
                  wordWrap: "break-word",
                  whiteSpace: "pre-wrap",
                }}
                onClick={async (e) => {
                  SetEndCov(endCov + 1);
                  setGuessFlag(false);
                  await connectRasa(e.target.innerText, "suggest");
                }}
              >
                I believe in you, and I know you'll make the right choice.
              </Tag>
              ,
              <Tag
                color="geekblue"
                style={{
                  overflowWrap: "break-word",
                  lineHeight: "1.2",
                  maxHeight: "3.6em",
                  fontSize: "1rem",
                  wordWrap: "break-word",
                  whiteSpace: "pre-wrap",
                }}
                onClick={async (e) => {
                  SetEndCov(endCov + 1);
                  setGuessFlag(false);
                  await connectRasa(e.target.innerText, "suggest");
                }}
              >
                Think about what you want from your next job, then work from
                there.
              </Tag>
            </div>
          ) : (
            <></>
          )}
        </>
      </div>
    </>
  );
};

export default VoiceChabot;
