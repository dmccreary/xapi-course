# Transcript of xAPI Collective: Beyond the LMS with Shelly Blake-Plock

**Source:** Julian Davis YouTube  
**Title:** xAPI Collective: Beyond the LMS with Shelly Blake-Plock  
**Date:** March 26, 2026

## Summary

- The session explored why learning infrastructure matters more than individual platforms,
especially as organizations invest in AI, analytics, and digital transformation.
- Shelly Blake-Plock explained that the old LMS-centered model is too narrow for modern learning
ecosystems.
- He described the "Total Learning Architecture" as a broader approach to managing learning data
across many systems and experiences.
- One core pillar is richer learning metadata, which should describe learning experiences more fully
than traditional course-based models.
- Another pillar is xAPI, which tracks activity and learning beyond formal courses, including
informal, workplace, and real-world learning.
- Shelly argued that learning should be understood as something continuous and distributed, not
limited to scheduled training events.
- He also discussed competency models, emphasizing that competencies are dynamic, interconnected,
and develop over time rather than existing as simple fixed checklists.
- The Enterprise Learner Record was presented as a way to represent changing learner state, not just
a static transcript of past achievements.
- A major theme was the shutdown of ADL and the creation of I2-IDL to preserve open infrastructure,
conformance testing, certification, and community support for standards like xAPI.
- The session closed by connecting open standards to emerging AI use cases, especially the need to
model and track human-AI interactions in more transparent and explainable ways.

## Description

With Shelly Blake-Plock from the Institute for Infrastructure and Interoperable Data in Learning.

What if the real innovation in learning is not another tool, but the infrastructure behind it?

In this session, the xAPI Collective is joined by Shelly Blake-Plock from the Institute for Infrastructure and Interoperable Data in Learning to explore a big question:

Are our learning systems built for the world we are moving into?

As organizations invest in AI, analytics, and digital transformation, many are discovering that the real challenge is not content. It is the underlying systems: how data flows, how tools connect, and how learning experiences live beyond a single platform.

This conversation explores:

- Why learning infrastructure matters more than ever
- What "interoperable" actually means in practical terms
- How AI depends on structured, connected data
- Why thinking beyond the LMS is becoming essential
- What this shift could mean for Australian organizations

This is not a technical deep dive. It is a forward-looking conversation about how we design learning ecosystems that are more flexible, connected, and future-ready.

If you are curious about where learning is heading and how infrastructure quietly shapes everything we do, this session is for you.

## Transcript

**Julian Davis:**  
Good morning, everyone, or good afternoon or good evening depending on where you are joining us from around the globe.

Welcome to our second session of the xAPI Collective. Today we are joined by Shelly Blake-Plock, who I will introduce in a little more detail in a moment, to have a chat with us about what I2-IDL is, where it is going, and where open standards are heading following a recent change in the xAPI world last year.

For those who have not been here before, we are a practitioner-led community and we are very much focused on real, practical things: what is happening in the world and how to bring it into Australia. A lot of events happen in the US or in Europe, and many of us cannot make it, so we are thankfully getting some of those guests to come in and talk to us in time zones that make it more available for us to attend.

I really do appreciate Shelly's time in joining us. Our little catchphrase here is that learning data should help us make better decisions, and the Collective exists to make that possible by sharing use cases, sharing tools, and sharing what is happening in the world of xAPI.

I would like to introduce Shelly. Shelly is the president of the Institute for Infrastructure and Interoperable Data in Learning. That is a mouthful, and Shelly will explain what that is in just a minute. He is focused on building the data architecture that allows learning systems to work together. He is also the co-founder and CEO of Yet Analytics, which some of you may have heard of.

Over the past decade, Shelly has become a leading voice in conversations about learning infrastructure, open standards, and how learning ecosystems move beyond individual platforms toward more connected and interoperable systems.

Today he works with organizations around the world exploring how interoperable data and modern learning records can support the next generation of learning and workforce development.

We are really excited to have him join us today so we can talk about moving beyond the LMS and think about the future of learning infrastructure. I am going to stop sharing so Shelly and I can have a bit of a chat.

Shel, welcome.

**Shelly Blake-Plock:**  
Hey, thank you for having me.

**Julian Davis:**  
I appreciate that. It is your dinner time over there while it is our morning coffee break over here, so we really appreciate it.

Tell us a bit about I2-IDL. What is it? Where has it come from? What is it all about? Some people may not have heard about it.

**Shelly Blake-Plock:**  
Sure. Probably folks on this call have heard about ADL over the last 30 years. Advanced Distributed Learning, a program in the US government, has been the shepherd and steward of many of the critical learning and learning-data standards, beginning with SCORM about 25 years ago and then, in 2010, providing the funding for the original research and development in xAPI and shepherding that through the process.

In my work, I wear a couple of hats, and one of them is that I have been on the IEEE Learning Technology Standards Committee since 2018.

During that time, part of my role and part of my advocacy has been the shifting of specification development within ADL into open standards development within IEEE. So now IEEE has gone beyond the standardization of xAPI, which occurred back in 2023, to include the entire suite of attendant standards that make up what we refer to as the Total Learning Architecture.

This was a design concept that came through ADL. The Total Learning Architecture includes four pillars.

The first pillar is learning metadata. Learning metadata is governed by an IEEE standard called 1484.12.1.

In previous generations of learning standards, we had learning object metadata standards. These were often meant to specifically describe courses, and it reflected a mentality of e-learning that looked like a digitization of what came before. We had books and courses, and if you think about the structure of learning management systems, especially as they originally came to be, they very much worked within the paradigm of providing a digital representation of traditional management concepts.

I do not even really think about LMSs as learning things. I think about them as being more about the structuring, managing, and regulation of information.

That was very much the way we described things. The new learning metadata standards say that, of course, courses will probably be important for a very long time. However, that is not the be-all and end-all of what learning experiences are.

So what if, instead of providing metadata simply about courses, we think about metadata in terms of learning experiences themselves? Instead of saying, "This course is a science course taught at this school by this instructor," we are saying things like, "This is a science course taught by this instructor at this school, and it is done in this modality, and it uses these sorts of instructional strategies, and these are all the different sorts of resources that are linked and interchanged across the web that support it."

That is the idea behind the metadata.

The second pillar is xAPI and xAPI Profiles. If you think about learning metadata as pillar number one, learning activity is pillar number two.

In the same way that I describe learning metadata as being more expansive and more flexible, and maybe a little bit more dangerous in the data model in terms of always pinning down what things mean, xAPI is similar in the sense that it represents a way to describe not solely learning experiences as though learning experiences only existed within something we call a learning moment, but rather all activity and behaviors that exist within the ongoing expression of what it is to be a human who, at any given point, may be learning something.

It is a shift from thinking, "Stop what you are doing because now from 10:00 until 11:00 we are going to be learning," into a paradigm that says learning can and does happen at any time. Learning does not depend on learning content in order for it to happen. Learning can happen through a variety of informal means.

It can happen in any sort of way. I am sure everyone here has learned things on YouTube or wherever else. You did not do it because you said, "Okay, well, I have to register for my YouTube time in order to take my YouTube class, and then there is going to be a quiz at the end." None of those things happen, and yet obviously we use those things to learn.

So xAPI exists in a paradigm where you can provide semantic data-modeling description and tracking of information related to the way people learn, are trained, and perform over time, whether or not it is something formal, on the job, or informal.

The third pillar is the way that we look at competencies. Traditionally, competencies are these very hierarchical things. The way that we think about machine-readable, shareable competency definitions within IEEE 1484.20.2 and 20.3 is that they are more like nodes on a graph. The nodes themselves have subnodes, and the subnodes can contain descriptors, and all of these things flow together and represent the complete flowering of competency.

Think about a traditional competency framework. It might say, "Okay, you know how to do X. X is the competency. It is the subject matter or topic that you are competent in."

However, in reality, there are a variety of different levels of proficiency within a competency. Within those levels of proficiency, there are different elements of stress and difficulty that are contextual to those proficiencies. There could also be instructional rubrics that seek to observe and identify what actually happens during not the summative old version of competency, where you get a stamp-of-approval credential, but the formative activity of learning that occurs during the development of competencies.

Just as importantly, this includes the kinds of changes in thinking that replace or nullify things we considered competencies in the past.

That gets into the fourth pillar, which is this idea of the Enterprise Learner Record. This is probably poorly named, but it is IEEE P2997.

What we are thinking about here is not a record in terms of a digital transcript. Instead, it is a record as a representation of state.

We tend to think about things like transcripts as if they tell us, "I went to school, I studied English, therefore I can be an English teacher, and I will always be an English teacher, and I will continue to know those things forever." I do not know about you, but I do not really remember college.

The idea is that learner state changes.

Sometimes people get confused about this, but think about it from a training point of view. If I am training for a marathon and I know I need to build stamina and endurance so that I can run at a certain speed for a certain time, then when I start maybe it takes me nine minutes to run a mile. As I progress, by the time I am ready to run my marathon maybe it takes me six minutes to run the mile, and I can do it consistently.

If we just said your competency is that you run a marathon in six-minute miles, we are actually throwing a wrench into a representation of reality, because the truth is that gaining the competency does not equal retaining the competency.

Whether we are talking about decay in learning and knowledge, or the fact that six months after running the marathon and eating a lot of junk food I cannot continue to run at the same rate, my state has changed. It should not and really cannot be reflected solely based on my prior historical event of having run the marathon as a representation of proficiency and competency itself.

My state now is in a different position from what came before it.

With all of these pillars, and all of these data models, we are looking at learning not as a static event, not as a primarily summative event, and not as an event that is exclusively regulated by things like courses, let alone tests and assessments of a certain variety.

When we think about the topic of this conversation, thinking beyond the LMS, the LMS is really pretty decent, sometimes, at doing a lot of those things. It is actually pretty decent at holding information on courses and letting you register for specific times and organizing things. It is a management tool. That is why management is in the name.

But everything I just described in terms of the data models and the data standards applies to that situation while also being bigger than it. They can all be used by LMSs, but they represent an outlook about learning and its relationship to data in a way that is wholly independent of LMSs.

**Julian Davis:**  
Yeah. So the LMS itself is a tool in the bigger architecture. It is just one of the tools.

**Shelly Blake-Plock:**  
Yeah. We have had this discussion in xAPI circles for a long time.

At one time, and for many organizations it is still like this, the LMS was the central hub of everything that happened. If you wanted to learn, you went to the LMS to launch your content.

One of the things that happened early on with the development of xAPI, and with a lot of the theorizing around what became the Total Learning Architecture, was the realization that there are so many learning experiences, whether they are XR, hybrid, synthetic learning, or even gathering biometrics for training athletes, that exist outside of the LMS paradigm.

So the LMS, rather than being the central hub with spokes feeding into it, instead becomes one of the edge distributors of information, along with headsets, applications, mobile devices, sensors, cyber-physical systems, and so on.

**Julian Davis:**  
That is it. So where does ADL fit into this now? Where is I2-IDL, or I2 as you guys like to call it, picking up from where ADL left off? And how can people get involved if they want to?

**Shelly Blake-Plock:**  
Everything I have described is part of the way things developed, where ADL was often the funder of research and the shepherd of technical certifications and specification development.

Those specifications that met certain needs then became IEEE standards activity. That portfolio of four pillars I just discussed represents the standardization of the work that was done at ADL.

In December, ADL was defunded, and ADL will not continue to exist at all. None of the hosted resources, the website, or most of the people who worked there directly remain. The last remnants of ADL will probably disappear over the next several weeks to few months.

It was recognized by many of us who worked with ADL, on ADL projects, and on ADL research over the last decades that if ADL simply turned off, many of the core capabilities, structures, and third-party resources would disappear.

It has always been somewhat problematic that these specifications and the certifications of these specifications, which end up within commercial platforms, research universities across the world, other governments, and so on, were housed within the United States government.

So in some ways, what I2-IDL is doing is representing an independent, nongovernmental, nonprofit research institute that will first provide access to resources formerly held in open source through ADL.

Second, we have been recognized by IEEE and the Learning Technology Standards Committee, and we will be standing up the canonical data conformance tests and providing the certifications. There will be official I2-IDL certifications for any software that uses these standards.

Some of you will be familiar with the LRS test suite that was held by ADL. That is gone. So we will be standing up a new I2-IDL test suite for xAPI.

However, we are not going to stop there. We are also going to provide a new xAPI Profile validation capability and xAPI Statement Template capability tied to a new profile server.

We are going to be doing standardization and certification for profiles of learning metadata as well as shareable competency definitions, and we will be standing up the reference model for the Enterprise Learner Record repository, the state machine that I described earlier when I was talking about the four pillars.

So that is the immediate work that I2-IDL is doing.

We are not ADL 2.0. Instead, you can think of it this way: a lot of great work occurred at ADL, and a lot of it is work that industry partners and international governmental partners absolutely depend upon. We are triaging by reestablishing those capabilities in an open, public way, freely, for everyone to use so that we can guarantee the trust of certification and conformance.

Otherwise, if this is not done, we are afraid that the larger xAPI ecosystem and the rest of these standards will return to the wild west that some of us remember from 2014 and 2015.

**Julian Davis:**  
Yeah. We do not want that.

**Shelly Blake-Plock:**  
No. No, we do not.

**Julian Davis:**  
That is great. You talked about the profile server, which is something that is front-of-mind for me when trying to explain to people what xAPI is and the role of profiles and the bigger benefits around them. Having that server stand up is going to be massive, because the server ADL had and that was used quite a bit was shut down overnight.

**Shelly Blake-Plock:**  
Wow. It is gone. It does not exist.

We cannot be in a position where political whims and budgets that are completely out of our control can turn off the capabilities that so many of us, whether in the open-source community like myself or in industry or government, depend on. We cannot let that happen again.

That is the first thing we are focused on.

The second thing is that one of the great functions of ADL over the years was to fund and provide a place for research on infrastructure and interoperability to occur. We want to stand that up again for where things are now.

ADL stood up in 1997. That was a different time. People were still using CD-ROMs to load courses.

But here we are now, and I do not even have to go into it. We all recognize some of the things going on, and we need an organization to be able to fund, support, represent, and incubate research that exists for now, not what it was 10 years ago.

Otherwise, we risk losing an entire generation of open-source contributors and researchers in the learning technology space because the pendulum swings back and forth.

My biggest concern right now is that it becomes very easy for large organizations to say, "We are just going to buy something from one big single vendor." That creates a monolithic situation, which has two effects.

One is that eventually those organizations realize the same things that organizations always realize about large monolithic vendors.

The second is that it shifts the finances and resources available in the learning space into a very limited set of options, and all of the researchers and open-source developers are left to starve.

So that is another thing we want to provide: a place where this type of research can both happen and thrive, and where we can pull in young people, young researchers, and people in college to get into this now.

I hesitate to call it a workforce. We have to build and nurture the kind of community that we want and that we will later rely on to build the things that come next.

Without resources like ADL, that becomes very difficult.

I honestly do not know whether we are going to live up to that challenge, but it is something we are attempting to take on.

**Julian Davis:**  
I guess one other thing I wanted to ask is this: something I am noticing is that there are trust issues in some organizations and educational settings. There is still a lot of, "We have always done it this way. Why should we look at xAPI?" Everyone knows SCORM, but people are still nervous.

Do you see trust shifting toward these open-standard technologies and open standards more broadly?

**Shelly Blake-Plock:**  
Yeah, it is a really good question.

The majority of the work I have been working on has been in the simulation space, and specifically what we refer to as fourth-generation simulations, which are simulations that highly leverage artificial intelligence.

If you think about traditional simulations, they are very hierarchical and scaffolded. They are full of scripts. We have very highly defined scenarios. That has been the traditional way to do it.

In what we refer to as a fourth-generation model, we do not use AI to create content. Instead, we use AI to help guide and make realistic the kinds of asymmetric decision paths that occur during real conversations and the kind of learning that might happen between people in a classroom, in a coffee shop, or wherever.

Why I bring that up is that my biggest concerns about AI generally, as it regards learning, come down to three things.

One is the environment, because I really do not want to live in Mad Max.

The second is the way that we think about human identity. We are already seeing situations where people are being accused of being AI, and it is really strange.

The third is a practical issue from a data perspective: AI is notoriously a black box.

We have tried for a long time to pursue the concept of explainable AI. I do not think we ever get to fully explainable AI. However, I do think we can implement open standards like xAPI.

If you think about xAPI as a way to represent that activity occurred, we can definitely establish profiles and patterns that allow us to track and make decisions or observations about interactions that happen between humans and machines.

If you think about it from a human-computer interaction standpoint, with the learner on one side and AI on the other and they are conversing, like in an AI-enabled simulation, the conversation itself, the nature of the conversation, and the behaviors that occur can be modeled as xAPI.

We can create an element of explainability out of the ability to model and then track behavior and activity that occurs within those interactions between humans and computers.

**Julian Davis:**  
Yeah, I think that is important, because a lot of times when people talk about xAPI they still say it is a great way to make dashboards.

I cannot speak for anyone else, but I work in xAPI all the time and I have not made a dashboard for anyone in years.

It is interesting, isn’t it?

**Shelly Blake-Plock:**  
Yeah. What is important is the fact that you can model deterministic data and provide it into whatever business systems you need it to be used in.

That can include dashboards and reporting systems, but it can also include talent-management systems to surface high performers. It can include mission-critical readiness systems that identify whether you have the right people and the right team chemistry for a mission.

It can be the use of xAPI activity for understanding, from a resource standpoint, whether you actually have the resources necessary to serve the people who need the learning.

Then there is this whole question of explainability in the interactions between human learners and AI.

I think that, in general, the use cases for xAPI are moving more in that direction, which also probably changes some of the ways we think about what learning is within an organization.

**Julian Davis:**  
I know we are getting quite short on time, and I could sit here and talk to you all day about all this and what is going on.

I have put the I2-IDL link into the chat, so please jump on there and subscribe. You do have a newsletter and a subscription there, or people can follow you on LinkedIn. There is an enormous amount happening in this space at the moment, so I encourage everyone to have a look at what is going on.

Andrew, I do not know if you had anything.

**Andrew:**  
I was just going to say that with the I2-IDL stuff, everything is completely open. If you do not want to sign up for a mailing list, please do not. Just reach out to me directly. Reach out to me directly and we can have a conversation, and I can make sure you get whatever information you need.

**Julian Davis:**  
That is awesome. Yeah.

I will quickly open it up to the audience. If anybody has a quick question or would like to add something, either put it in the chat or feel free to unmute before we wrap up, because we are getting very close.

**Chris:**  
Just send it to us in an xAPI statement and we will be able to decode it, put it in a dashboard, and send it through.

**Group:**  
Yeah.

**Julian Davis:**  
Okay. Just moving on with time, our next session is actually a lead-in from this one. It is quite good that Shel talked about profiles, because the next one, hopefully around the 15th of May, is going to have Jason Haag coming on to talk about profiles and how they work for defining your rules. That next session should be amazing, so keep an eye on the website for that link.

Thank you so much, Shelly, for your time. I appreciate that it is later there for you, and I really do appreciate you taking the time to explain to us what is going on in your world.

**Shelly Blake-Plock:**  
Well, thank you. I really appreciate the opportunity to chat. If anyone has any questions or anything comes up, feel free to reach out.

**Julian Davis:**  
Great. No worries.

On that note, we will let you go and finish your evening, Shel, and we will go and have the next coffee of the day.

Thanks, Shel.

**Shelly Blake-Plock:**  
All right. Thank you, everyone. Thanks for coming.
