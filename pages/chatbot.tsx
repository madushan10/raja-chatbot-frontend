/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import Layout from '@/components/layout';
import styles from '@/styles/Home.module.css';
import { Message } from '@/types/chat';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import Image from 'next/image';
import LoadingDots from '@/components/ui/LoadingDots';
import { AiOutlineClose, AiOutlineSend } from 'react-icons/ai';
import { Document } from 'langchain/document';
import axios from 'axios';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

const Chatbot = () => {
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiMessageFinal, setApiMessageFinal] = useState('');
  const [messageState, setMessageState] = useState<{
    messages: Message[];
    pending?: string;
    history: [string, string][];
    pendingSourceDocs?: Document[];
  }>({
    messages: [],
    history: [],
    pendingSourceDocs: [],
  });
  const { messages, pending, history, pendingSourceDocs } = messageState;
  const messageListRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [id, setId] = useState('');
  const [liveAgent, setLiveAgent] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [showChatRating, setShowChatRating] = useState(false);
  const [agentName, setAgentName] = useState('');
  const [agentInfoMsg, setAgentInfoMsg] = useState(false);
  const [agentImage, setAgentImage] = useState('/chat-header.png');
  const [closeRating, setCloseRating] = useState(false);
  const [waitingLiveAgent, setWaitingLiveAgent] = useState(false);
  const [imgLiveBot, setImgLiveBot] = useState('bot'); //agent

  const [isProduct, setIsProduct] = useState('');
  const [isProductShow, setIsProductShow] = useState(false);
  const [isCardShow, setIsCardShow] = useState(false);
  const [cardTitle, setCardTitle] = useState('title');
  const [cardImage, setCardImage] = useState('');
  const [cardDesc, setCardDesc] = useState('desc');
  const [showSubProducts, setShowSubProducts] = useState(false);




  useEffect(() => {
    const now = Date.now();
    const newId = now.toString();
    setId(newId);
  }, []);
  // console.log('user id : ',id)

  useEffect(() => {
    textAreaRef.current?.focus();
  }, []);

  useEffect(() => { }, [
    apiMessageFinal,
    liveAgent,
    agentName,
    agentInfoMsg,
    agentImage,
    imgLiveBot,
    messages,
    waitingLiveAgent,
    isProduct,
    isCardShow,
    cardTitle,
    cardImage,
    cardDesc,
    showSubProducts,
    isProductShow,
    selectedQuestion
  ]);

  console.log(waitingLiveAgent);

  const [closeState, setCloseState] = useState(false);
  const handleCloseChat = async () => {
    setCloseState(true);

    const response = await fetch(
      'http://13.126.15.131:7000/chat-close-by-user',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chatId: id }),
      },
    );

    if (response.status !== 200) {
      const error = await response.json();
      throw new Error(error.message);
    }
    const data = await response.json();
    console.log(data.success);

    if (data.success === 'success') {
      setShowChatRating(true);
    } else {
      setShowChatRating(false);
    }
  };

  useEffect(() => {
    if (closeState === false) {
      if (liveAgent === true) {
        console.log('----------', id);
        const interval = setInterval(async () => {
          const response = await fetch(
            'http://13.126.15.131:7000/live-chat-agent',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ chatId: id }),
            },
          );

          if (response.status !== 200) {
            const error = await response.json();
            throw new Error(error.message);
          }
          const data = await response.json();

          if (data.chat_status === 'closed') {
            setShowChatRating(true);
          } else {
            setShowChatRating(false);
            setAgentInfoMsg(false);
            if (data.agent_id != 'unassigned') {
              if (!data.profile_picture) {
                setAgentImage('/chat-header.png');
              } else {
                setImgLiveBot('agent');
                setAgentImage(
                  'http://13.126.15.131:7000/uploads/' +
                  data.profile_picture,
                );
              }
              setAgentName(data.agent_name);
              setWaitingLiveAgent(false);
              setAgentInfoMsg(true);
              if (data.agent_message != null) {
                setMessageState((state) => ({
                  ...state,
                  messages: [
                    ...state.messages,
                    {
                      type: 'apiMessage',
                      message: data.agent_message,
                    },
                  ],
                  pending: undefined,
                }));
              }
            }
          }
        }, 5000);
        return () => clearInterval(interval);
      }
    }
  }, [id, liveAgent, waitingLiveAgent]);



  // const cardTempleteData = [
  //   {
  //     id: "1",
  //     title: "Digital Banking",
  //     image: "/banner1.jpg",
  //     desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Modi quam, expedita totam dolor voluptate ea.",
  //     subProducts: [
  //       {
  //         id: '1',
  //         title: "Digital Banking sub 1",
  //         image: "/banner1.jpg",
  //         desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Modi quam, expedita totam dolor voluptate ea.",
  //         subProducts_L1: [
  //           {
  //             id: '1',
  //             title: "Digital 1",
  //             image: "/banner1.jpg",
  //             desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Modi quam, expedita totam dolor voluptate ea.",
  //           },
  //           {
  //             id: '2',
  //             title: "Digital 2",
  //             image: "/banner1.jpg",
  //             desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Modi quam, expedita totam dolor voluptate ea.",
  //           },
  //           {
  //             id: '3',
  //             title: "Digital 3",
  //             image: "/banner1.jpg",
  //             desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Modi quam, expedita totam dolor voluptate ea.",
  //           }
  //         ]
  //       },
  //       {
  //         id: '2',
  //         title: "Digital Banking sub 2",
  //         image: "/banner1.jpg",
  //         desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Modi quam, expedita totam dolor voluptate ea.",
  //       }
  //     ],
  //   },
  //   {
  //     id: "2",
  //     title: "Saving Account",
  //     image: "/banner2.jpg",
  //     desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Modi quam, expedita totam dolor voluptate ea.",
  //   },
  //   {
  //     id: "3",
  //     title: "DFCC Platinum Card",
  //     image: "/banner3.jpg",
  //     desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Modi quam, expedita totam dolor voluptate ea.",
  //   }
  // ]

  async function handleDefaultQuestions(defaultQuestion : any){
    setLoading(true);

    setMessageState((state) => ({
      ...state,
      messages: [
        ...state.messages,
        {
          type: 'userMessage',
          message: defaultQuestion,
        },
      ],
      pending: undefined,
    }));

    try {
      
      const response = await fetch(
        'http://13.126.15.131:7000/raja-chat-bot-api',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_Message: defaultQuestion,
            language: selectedLanguage,
            chatId: id,
          }),
        },
      );

      if (response.status !== 200) {
        const error = await response.json();
        throw new Error(error.message);
      }
      const data = await response.json();
      if(data.status == "success"){
          setMessageState((state) => ({
          ...state,
          messages: [
            ...state.messages,
            {
              type: 'apiMessage',
              message: data.bot_reply,
            },
          ],
          pending: undefined,
        }));
      }
      setLoading(false);
    } catch (error) {
      console.log("error")
    }
  }


  //handle form submission
  async function handleSubmit(e: any) {
    try {
      if (liveAgent === false) {
        e.preventDefault();
        setError(null);
  
        if (!query) {
          alert('Please input a question');
          return;
        }
        // get user message
        let question = query.trim();
  
        // set user message array
        setMessageState((state) => ({
          ...state,
          messages: [
            ...state.messages,
            {
              type: 'userMessage',
              message: question,
            },
          ],
          pending: undefined,
        }));
        
  
        console.log('user message : ', question);
  
        setLoading(true);
        setQuery('');
        setMessageState((state) => ({ ...state, pending: '' }));
  
  
        
  
        // console.log(question)
        // products
        // const responseProduct = await fetch(
        //   '/api/productservice',
        //   {
        //     method: 'POST',
        //     headers: {
        //       'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //       user_Question: selectedQuestion
        //     }),
        //   },
        // );
        // const dataProducts = await responseProduct.json();
        // console.log("dataProducts : ", dataProducts);
  
        // setIsProduct(dataProducts.result.trim());
        // let ProductType = dataProducts.result.trim();
        // console.log("isProduct : ", ProductType);
  
  
  
  
  
  
  
  
        // translate to sinhala
        const response = await fetch(
          'http://13.126.15.131:7000/raja-chat-bot-api',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user_Message: question,
              language: selectedLanguage,
              chatId: id,
            }),
          },
        );
  
        if (response.status !== 200) {
          const error = await response.json();
          throw new Error(error.message);
        }
        const data = await response.json();
        if (data.status == 'success') {
          setMessageState((state) => ({
            ...state,
            messages: [
              ...state.messages,
              {
                type: 'apiMessage',
                message: data.bot_reply,
              },
            ],
            pending: undefined,
          }));
          // check is product or not
          // if (
          //   ProductType.includes("sorry") ||
          //   ProductType.includes("sorry.") ||
          //   ProductType.includes("Sorry") ||
          //   ProductType.includes("Sorry.")
          // ) {
          //   console.log("not a product ");
          // } else {
          //   console.log("is a product");
          //   // set product message button
          //   setMessageState((state) => ({
          //     ...state,
          //     messages: [
          //       ...state.messages,
          //       {
          //         type: 'productMessage',
          //         message: '',
          //       },
          //     ],
          //     pending: undefined,
          //   }));
          // }
          setLoading(false);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }





  const [selectedSubProduct, setSelectedSubProduct] = useState('');

  const handleCards = async () => {
    try {
      console.log("view -----", isProduct);

      // const matchingCards = cardTempleteData.filter((card) =>
      //   isProduct.includes(card.title)
      // );

      // matchingCards.forEach((card) => {
      //   const { title, image, desc } = card;

      //   setCardTitle(title)
      //   setCardImage(image)
      //   setCardDesc(desc)

      //   console.log('Title:', title);
      //   console.log('Image:', image);
      //   console.log('Description:', desc);
      // })
      setMessageState((state) => ({
        ...state,
        messages: [
          ...state.messages,
          {
            type: 'userMessage',
            message: 'View Products and Services',
          },
        ],
        pending: undefined,
      }));

      setMessageState((state) => ({
        ...state,
        messages: [
          ...state.messages,
          {
            type: 'cardMessage',
            message: '',
          },
        ],
        pending: undefined,
      }));
      setIsCardShow(true)
    } catch (error) {
      console.error(error);
    }

  }

  // const handleSubCards = async (prduct: string | string[]) => {
  //   try {
  //     console.log("selectedSubProduct -----", prduct);

  //     const matchingCards = cardTempleteData.filter((card) =>
  //       prduct.includes(card.title)
  //     );

  //     matchingCards.forEach((card) => {
  //       const { title, image, desc } = card;

  //       setCardTitle(title)
  //       setCardImage(image)
  //       setCardDesc(desc)

  //       console.log('Title:', title);
  //       console.log('Image:', image);
  //       console.log('Description:', desc);
  //     })
  //     setMessageState((state) => ({
  //       ...state,
  //       messages: [
  //         ...state.messages,
  //         {
  //           type: 'userMessage',
  //           message: `${prduct}`,
  //         },
  //       ],
  //       pending: undefined,
  //     }));

  //     setMessageState((state) => ({
  //       ...state,
  //       messages: [
  //         ...state.messages,
  //         {
  //           type: 'cardMessage',
  //           message: '',
  //         },
  //       ],
  //       pending: undefined,
  //     }));
  //     setIsCardShow(true)

  //   } catch (error) {
  //     console.error(error);
  //   }

  // }




  const handleLiveAgent = async (e: any) => {
    e.preventDefault();
    setError(null);

    if (!query) {
      alert('Please input a question');
      return;
    }
    let question = query.trim();
    // console.log('========== Go to live agent =========')
    setMessageState((state) => ({
      ...state,
      messages: [
        ...state.messages,
        {
          type: 'userMessage',
          message: question,
        },
      ],
      pending: undefined,
    }));
    if (liveAgent === true) {
      const response = await fetch(
        'http://13.126.15.131:7000/live-chat-user',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ chatId: id, user_Message: question }),
        },
      );

      if (response.status !== 200) {
        const error = await response.json();
        throw new Error(error.message);
      }
      const data = await response.json();
      setQuery('');
    }
  };

  const SwitchToLiveAgent = async () => {
    // console.log('========== Switch to live agent =========')
    const response = await fetch(
      'http://13.126.15.131:7000/switch-to-live-agent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chatId: id }),
      },
    );

    if (response.status !== 200) {
      const error = await response.json();
      throw new Error(error.message);
    }
    const data = await response.json();
    setWaitingLiveAgent(true);
    // console.log('if success : ', data.success)
    if (data.success === 'Success') {
      setLiveAgent(true);
    }
  };

  //prevent empty submissions
  const handleEnter = useCallback(
    (e: any) => {
      if (e.key === 'Enter' && query) {
        if (liveAgent === false) {
          handleSubmit(e);
        } else {
          handleLiveAgent(e);
        }
      } else if (e.key == 'Enter') {
        e.preventDefault();
      }
    },
    [query],
  );

  const chatMessages = useMemo(() => {
    return messages.filter(
      (message) =>
        message.type === 'userMessage' || message.message !== undefined,
    );
  }, [messages]);
  // console.log('messages : ', messages);

  //scroll to bottom of chat
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [
    chatMessages,
    closeRating,
    showChatRating,
    closeState,
    waitingLiveAgent,
    agentInfoMsg,
    isProductShow
  ]);

  async function sendRateValues() {
    // const sendData = async (botName, index) => {
    try {
      console.log('chat id : ', id);
      console.log('rating : ', rating);
      console.log('feedback : ', inputValue);

      const response = await fetch('/api/star_rating', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatId: id,
          ratingValue: rating,
          feedbackMessage: inputValue,
        }),
      });
      const ratingData = await response.json();
      setCloseRating(true);
      console.log('rating data : ', ratingData);
    } catch (error) {
      console.error(error);
    }
    // }
  }

  return (
    <Layout>
      {/* chat top header =======================*/}
      <div className={`${styles.chatTopBar} d-flex flex-row `}>
        <div className="col-12 text-center d-flex flex-row justify-content-between px-2">
          {/* <Image src="/chat-top-bar.png" alt="AI" width={150} height={30} /> */}
          <h5>Raja jewellers</h5>
          <button
            className="close-button"
            onClick={handleCloseChat}
            title="Close Chat"
          >
            <AiOutlineClose />{' '}
          </button>
        </div>
      </div>
      {/* chat top header end =======================*/}

      <div ref={messageListRef} className={`${styles.messageWrapper}`}>
        {/* language switch message =================*/}
        <div className={styles.botMessageContainerWrapper}>
          <div className="d-flex justify-content-center pt-1">
            <Image src="/Asset-1-2.png" alt="AI" width={150} height={50} className='img-fluid' />
          </div>

          <div
            className={`${styles.botChatMsgContainer} d-flex flex-column my-2`}
          >
            <div className="d-flex">
              <Image src="/chat-header.png" alt="AI" width="40" height="40" />
            </div>
            <div className={`d-flex flex-column py-3`}>
              <div
                className={`welcomeMessageContainer d-flex flex-column align-items-center`}
              >
                <Image
                  src="/language-img.png"
                  alt="AI"
                  width={150}
                  height={150}
                />
                <p className="mt-2">
                  Hello, Welcome to Raja jewellers. 
                </p>
                <div className="d-flex flex-column welcome-language-select w-100">
                  <div className="col-12 pe-1">
                    {/* <button
                      className=" px-3 py-2 "
                      onClick={() => {
                        handleDefaultQuestions('What is the 22kt Gold rate today?');
                      }}
                    >
                      What is the 22kt Gold rate today?
                    </button> */}
                    <button
                      className="px-3 py-2 mt-2"
                      onClick={() => {
                        handleDefaultQuestions('Where are you located at?');
                      }}
                    >
                      Where are you located at?
                    </button>
                    <button
                      className="px-3 py-2 mt-2"
                      onClick={() => {
                        handleDefaultQuestions('What are your opening hours?');
                      }}
                    >
                      What are your opening hours?
                    </button>
                    {/* <button
                      className="px-3 py-2 mt-2"
                      onClick={() => {
                        handleDefaultQuestions('What is the old gold exchange rate?');
                      }}
                    >
                      What is the old gold exchange rate?
                    </button> */}
                    {/* <button
                      className="px-3 py-2 mt-2"
                      onClick={() => {
                        handleDefaultQuestions("What's the price of gold coin today?");
                      }}
                    >
                      What&#39;s the price of gold coin today?
                    </button> */}
                    <button
                      className="px-3 py-2 mt-2"
                      onClick={() => {
                        handleDefaultQuestions("I'm not in Sri Lanka, I need to get some details?");
                      }}
                    >
                      I&#39;m not in Sri Lanka, I need to get some details?
                    </button>
                    <button
                      className="px-3 py-2 mt-2"
                      onClick={() => {
                        handleDefaultQuestions('Do you do custom-made jewelry?');
                      }}
                    >
                      Do you do custom-made jewelry?
                    </button>
                    <button
                      className="px-3 py-2 mt-2"
                      onClick={() => {
                        handleDefaultQuestions('Can I get a quotation for a custom-made jewelry?');
                      }}
                    >
                      Can I get a quotation for a custom-made jewelry?
                    </button>
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* language switch message end =================*/}

        {/* message conversation container =================*/}
        <div className={`${styles.messageContentWrapper} d-flex flex-column`}>
          {/* user and api messages =================*/}
          {chatMessages.map((message, index) => {
            if (
              message.type !== 'apiMessage' &&
              message.type !== 'userMessage' &&
              message.type !== 'productMessage' &&
              message.type !== 'cardMessage'
            ) {
              // skip rendering if the message type is not 'apiMessage' or 'userMessage'
              return null;
            }
            let icon;
            let className;
            let userHomeStyles;
            let iconWrapper = 'justify-content-end';
            let wrapper = 'align-items-end justify-content-end';
            let userStyles = 'justify-content-end flex-row-reverse float-end';

            if (message.type === 'apiMessage') {
              if (imgLiveBot === 'bot') {
                icon = (
                  <Image
                    src="/chat-header.png"
                    alt="AI"
                    width="40"
                    height="40"
                    className={styles.botImage}
                    priority
                  />
                );
              } else {
                icon = (
                  <Image
                    src={agentImage}
                    alt="AI"
                    width="40"
                    height="40"
                    className={styles.botImage}
                    priority
                  />
                );
              }
              className = styles.apimessage;
              iconWrapper = 'justify-content-start';
              userStyles = 'justify-content-start flex-row float-start';
              wrapper = 'align-items-start justify-content-start';
            } else if (message.type === 'userMessage') {
              icon = (
                <Image
                  src="/user.png"
                  alt="Me"
                  width="40"
                  height="40"
                  className={styles.botImage}
                  priority
                />
              );
              userHomeStyles = styles.userApiStyles;
              iconWrapper = 'justify-content-end';
              // The latest message sent by the user will be animated while waiting for a response
              className =
                loading && index === chatMessages.length - 1
                  ? styles.usermessagewaiting
                  : styles.usermessage;
            }
            else if (message.type === 'productMessage') {
              className = styles.agentmessage;
              userStyles = 'justify-content-start flex-row float-start';
              wrapper = 'align-items-start justify-content-start ps-5';
            }
            else if (message.type === 'cardMessage') {
              className = styles.agentmessage;
              userStyles = 'justify-content-start flex-row float-start';
              wrapper = 'align-items-start justify-content-start ps-5';
            }

            // const isLastApiMessageWithNotSure =
            //   message.type === 'apiMessage' &&
            //   message.message.includes("Hmm, I'm not sure" || "හ්ම්, මට විශ්වාස නෑ." || "ஹ்ம்ம், எனக்கு உறுதியாக தெரியவில்லை") &&
            //   index === chatMessages.length - 1;
            const notSureMessages = [
              "Hmm, I'm not sure..",
              'ප්රශ්නයක් නැත',
              'கேள்வியே இல்லை',
            ];
            const isLastApiMessageWithNotSure =
              message.type === 'apiMessage' &&
              notSureMessages.some((text) => message.message.includes(text)) &&
              index === chatMessages.length - 1;

            const text = message.message;
            const bulletPoints = text.split(/\n/);

            // let containerClassName = styles.botMessageContainer;
            // if (message.type === 'productMessage') {
            //   containerClassName = styles.productMessageContainer;
            // }

            const linkifyText = (text: string) => {
              const urlRegex = /(https?:\/\/[^\s]+)/g;
              const bulletRegex = /^\d+\./;

              const urlText = text.replace(urlRegex, (url: string) => `<a href="${url}" target="_blank">${url}</a>`);
              const bulletText = urlText.replace(bulletRegex, '&#x2022;');
              return bulletText;

              // return text.replace(urlRegex, (url: any) => `<a href="${url}" target="_blank">${url}</a>`);
            };



            return (
              <>
                <div
                  key={`chatMessage-${index}`}
                  className={styles.botMessageContainerWrapper}
                >
                  <div
                    className={`${styles.botChatMsgContainer} ${userStyles} d-flex flex-column-reverse my-2`}
                  >
                    <div className={`${iconWrapper} d-flex `}>{icon}</div>
                    <div className={`${wrapper} d-flex flex-column ms-2`}>
                      <div
                        className={`${styles.botMessageContainer} ${userHomeStyles} d-flex flex-column my-1`}
                      >
                        {/* {bulletPoints.map((point, index) => (
                          <p key={index} className="mb-0">
                            {point}
                          </p>
                        ))} */}
                        {bulletPoints.map((point, index) => (
                          <p key={index} className="mb-0" dangerouslySetInnerHTML={{ __html: linkifyText(point) }} />
                        ))}
                        {/* <p className="mb-0">{message.message}</p> */}
                        {/* {message.type === 'apiMessage' && trMsg && (
                          <div
                            className={`${styles.botMessageContainer} ${styles.apimessage} d-flex flex-column my-1`}
                          >
                            <p className="mb-0">{trMsg}</p>
                          </div>
                        )} */}
                        {isLastApiMessageWithNotSure && (
                          <button
                            className={`bg-dark rounded text-white py-2 px-3 my-3`}
                            style={{
                              width: 'max-content',
                              alignSelf: 'center',
                            }}
                            onClick={() => {
                              SwitchToLiveAgent();
                            }}
                          >
                            Connect with Live Agent
                          </button>
                        )}
                        {/* {message.type === 'productMessage' && (
                          <button
                            className=" rounded text-white py-2 px-3 "
                            style={{
                              width: 'max-content',
                              alignSelf: 'center',
                              backgroundColor: 'red',
                            }}
                            onClick={() => {
                              handleCards()
                            }}
                          >
                            View Products and Services
                          </button>
                        )} */}
                        {/* {message.type === 'cardMessage' && (
                          <div className="d-flex flex-column card mb-2">
                            <div style={{ width: '235px' }}>
                              <Swiper
                                // install Swiper modules
                                modules={[Navigation, A11y]}
                                spaceBetween={0}
                                slidesPerView={1}
                                navigation
                                onSwiper={(swiper) => console.log(swiper)}
                                onSlideChange={() => console.log('slide change')}
                              >
                                {cardTempleteData.map((item) => (
                                  <SwiperSlide key={item.id} style={{ width: '200px' }}>
                                    <div className="d-flex justify-content-center">
                                      <Image
                                        src={item.image} // Use item.image instead of cardImage
                                        alt=''
                                        className='rounded p-0 m-0'
                                        width={235}
                                        height={150}
                                        style={{ width: "100% !important", height: "auto !important" }}
                                      />
                                    </div>
                                    <div className="d-flex flex-column">
                                      <p className='mt-3 px-2'><b>{item.title}</b></p>
                                      <p className='px-2'>{item.desc}</p>
                                      {item.subProducts && item.subProducts.length > 0 ? (
                                        <div className="d-flex flex-column">
                                          {item.subProducts.map((subProduct) => (
                                            <button
                                              key={subProduct.id}
                                              className="mb-2 text-white rounded px-3 py-2"
                                              style={{ backgroundColor: "red" }}
                                              onClick={() => {
                                                if (subProduct.subProducts_L1 && subProduct.subProducts_L1.length > 0) {
                                                  handleSubCards(subProduct.title);
                                                } else {
                                                  console.log("no sub products")
                                                }
                                              }}
                                            >
                                              {subProduct.title}
                                            </button>
                                          ))}
                                        </div>
                                      ) : (
                                        <button
                                          className="mb-0 text-white rounded px-3 py-2"
                                          style={{ backgroundColor: "red" }}
                                          onClick={() => {
                                            handleCards();
                                          }}
                                        >
                                          View
                                        </button>
                                      )}
                                    </div>
                                  </SwiperSlide>
                                ))}
                              </Swiper>
                            </div>
                          </div>
                        )} */}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            );
          })}
          {/* user and api messages end =================*/}
          {waitingLiveAgent && (
            <div className="d-flex bg-chat-close-msg text-center justify-content-center py-3">
              <p className="mb-0">
                One of our Customer Support agents will be with you soon. Stay
                tuned!
              </p>
            </div>
          )}
          {/* {
          agentInfoMsg && (
            <div className="alert alert-info mx-3 text-center  alert-dismissible fade show" role="alert">
              Now you are chatting with {agentName}
              <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
          )
        } */}
          {agentInfoMsg && (
            <div
              className="alert paddingalert alert-info mx-3 text-center  alert-dismissible fade show"
              role="alert"
            >
              <p
                className="mb-0 alertAgent"
                style={{ fontSize: '9px !important' }}
              >
                Now you are chatting with {agentName}
              </p>
              {/* <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button> */}
            </div>
          )}
          {closeState && (
            <div className="d-flex bg-chat-close-msg text-center justify-content-center py-3">
              <p className="mb-0">Thank you for contacting us.</p>
            </div>
          )}

          {/* show rating =================*/}
          {showChatRating && (
            <div className="d-flex flex-column" id="chatRating">
              <div className="d-flex">
                <Image src="/chat-header.png" alt="AI" width="40" height="40" />
              </div>
              <div className={`d-flex flex-column px-1 py-2`}>
                <div
                  className={`welcomeMessageContainer d-flex flex-column align-items-center`}
                >
                  <div className="container-fluid m-0 p-0">
                    <div
                      className={`${styles.botRateRequest} d-flex flex-row my-2 mx-2`}
                    >
                      <div
                        className={`${styles.botRatingContainer} d-flex flex-column my-1`}
                      >
                        <p className={`${styles.rateTitle} mb-0 text-dark`}>
                          Did we help you?
                        </p>
                        <p className="text-dark mb-0">Add your rating</p>
                        <div className="star-rating">
                          {[...Array(5)].map((star, index) => {
                            index += 1;
                            return (
                              <button
                                type="button"
                                key={index}
                                className={
                                  index <= (hover || rating) ? 'on' : 'off'
                                }
                                onClick={() => {
                                  setRating(index);
                                }}
                                onMouseEnter={() => setHover(index)}
                                onMouseLeave={() => setHover(rating)}
                              >
                                <span className="star">&#9733;</span>
                              </button>
                            );
                          })}
                        </div>
                        <p className={` mb-0 mt-3 text-dark`}>
                          Your feedback :
                        </p>
                        <textarea
                          className={`${styles.textarea} p-2 rounded`}
                          rows={3}
                          maxLength={512}
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                        />

                        <button
                          onClick={sendRateValues}
                          className="text-white bg-dark p-2 mt-2 rounded"
                        >
                          SEND
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* show rating end =================*/}

          {closeRating && (
            <div className="d-flex bg-chat-ratesuccess-msg text-center justify-content-center py-3">
              <p className="mb-0">Thank you for your feedback</p>
            </div>
          )}
        </div>
      </div>
      {/* message conversation container end =================*/}

      {/* input fields =================*/}
      <div className={`${styles.inputContainer}`}>
        <textarea
          disabled={loading}
          onKeyDown={handleEnter}
          ref={textAreaRef}
          autoFocus={false}
          rows={1}
          maxLength={512}
          id="userInput"
          name="userInput"
          placeholder={
            loading ? 'Waiting for response...' : 'What is this question about?'
          }
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={styles.textarea}
        />
        <button
          onClick={liveAgent === false ? handleSubmit : handleLiveAgent}
          disabled={loading}
          className={`${styles.inputIconContainer} `}
        >
          {loading ? (
            <div className={styles.loadingwheel}>
              <LoadingDots color="#fff" />
            </div>
          ) : (
            // Send icon SVG in input field
            <AiOutlineSend className={styles.sendIcon} />
          )}
        </button>
      </div>
      {error && (
        <div className="border border-red-400 rounded-md p-4">
          <p className="text-red-500">{error}</p>
        </div>
      )}
      {/* input fields end ================= */}
    </Layout>
  );
};

export default Chatbot;
