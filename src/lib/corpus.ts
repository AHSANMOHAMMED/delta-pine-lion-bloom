import type { CorpusDoc } from "@/lib/engine/types";

export const BUILTIN_CORPUS: CorpusDoc[] = [
  {
    id: "corpus_gettysburg",
    title: "Gettysburg Address (public domain)",
    kind: "corpus",
    url: "https://www.loc.gov/exhibits/gettysburg-address/exhibition-items.html",
    text: `Four score and seven years ago our fathers brought forth on this continent, a new nation, conceived in Liberty, and dedicated to the proposition that all men are created equal. Now we are engaged in a great civil war, testing whether that nation, or any nation so conceived and so dedicated, can long endure. We are met on a great battle-field of that war. We have come to dedicate a portion of that field, as a final resting place for those who here gave their lives that that nation might live. It is altogether fitting and proper that we should do this. But, in a larger sense, we can not dedicate — we can not consecrate — we can not hallow — this ground. The brave men, living and dead, who struggled here, have consecrated it, far above our poor power to add or detract. The world will little note, nor long remember what we say here, but it can never forget what they did here. It is for us the living, rather, to be dedicated here to the unfinished work which they who fought here have thus far so nobly advanced. It is rather for us to be here dedicated to the great task remaining before us — that from these honored dead we take increased devotion to that cause for which they gave the last full measure of devotion — that we here highly resolve that these dead shall not have died in vain — that this nation, under God, shall have a new birth of freedom — and that government of the people, by the people, for the people, shall not perish from the earth.`,
  },
  {
    id: "corpus_declaration",
    title: "Declaration of Independence (opening)",
    kind: "corpus",
    url: "https://www.archives.gov/founding-docs/declaration-transcript",
    text: `When in the Course of human events, it becomes necessary for one people to dissolve the political bands which have connected them with another, and to assume among the powers of the earth, the separate and equal station to which the Laws of Nature and of Nature's God entitle them, a decent respect to the opinions of mankind requires that they should declare the causes which impel them to the separation. We hold these truths to be self-evident, that all men are created equal, that they are endowed by their Creator with certain unalienable Rights, that among these are Life, Liberty and the pursuit of Happiness. That to secure these rights, Governments are instituted among Men, deriving their just powers from the consent of the governed. That whenever any Form of Government becomes destructive of these ends, it is the Right of the People to alter or to abolish it, and to institute new Government, laying its foundation on such principles and organizing its powers in such form, as to them shall seem most likely to effect their Safety and Happiness.`,
  },
  {
    id: "corpus_climate",
    title: "Reference notes: climate systems",
    kind: "corpus",
    text: `Earth's climate system is driven by the balance between incoming solar radiation and outgoing infrared radiation. Greenhouse gases including carbon dioxide, methane, and water vapor absorb longwave radiation emitted by the surface and reradiate it, warming the lower atmosphere. Since the late nineteenth century, atmospheric carbon dioxide has risen from about 280 parts per million to more than 420 parts per million, primarily from the combustion of coal, oil, and natural gas. Multiple independent observational records show that the global mean surface temperature has increased by roughly 1.1 degrees Celsius over that period. Polar amplification has produced faster warming in the Arctic than at lower latitudes, contributing to declining sea ice extent and thawing permafrost. Attribution studies using coupled climate models indicate that the observed warming cannot be explained by solar variability or volcanic aerosols alone. Continued emissions raise the probability of crossing thresholds associated with ice-sheet loss, coral bleaching, and disruption of regional monsoon systems. Mitigation pathways consistent with limiting warming to 1.5 degrees Celsius require rapid declines in fossil fuel use together with large-scale restoration of forests and soils that store carbon.`,
  },
  {
    id: "corpus_ml",
    title: "Reference notes: machine learning",
    kind: "corpus",
    text: `Machine learning is a family of statistical methods that infer patterns from examples rather than from hand-written rules. In supervised learning, a model is trained on labeled pairs of inputs and outputs so that it can predict the output for unseen inputs. Common supervised tasks include classification, which assigns a discrete label, and regression, which predicts a continuous value. Unsupervised learning instead searches for structure in unlabeled data, for example by clustering similar points or reducing dimensionality. A typical training loop minimizes a loss function with gradient-based optimization, updating parameters so that predictions better match the training labels. Overfitting occurs when a model memorizes idiosyncrasies of the training set and fails to generalize; regularization, early stopping, and held-out validation sets are standard remedies. Deep neural networks stack many layers of nonlinear transformations and have become the dominant approach for images, speech, and natural language. Despite their accuracy, such models can be brittle under distribution shift and may reproduce biases present in the data they were trained on.`,
  },
  {
    id: "corpus_photo",
    title: "Reference notes: photosynthesis",
    kind: "corpus",
    text: `Photosynthesis converts light energy into chemical energy stored in sugars. In plants, the process takes place in chloroplasts, where chlorophyll pigments absorb photons and initiate electron transport. The light-dependent reactions split water, release oxygen, and generate ATP and NADPH. The Calvin cycle then uses those products to fix carbon dioxide into three-carbon sugars through the enzyme Rubisco. C3 plants perform this cycle in mesophyll cells, while C4 plants spatially separate initial carbon capture from the Calvin cycle to reduce photorespiration in hot climates. Net primary productivity of an ecosystem is the remainder of photosynthetic carbon gain after plant respiration. Factors that limit the rate of photosynthesis include light intensity, carbon dioxide concentration, temperature, and the availability of water and mineral nutrients. Because photosynthesis removes carbon dioxide from the air and stores carbon in biomass, changes in land cover that reduce leaf area have a measurable effect on the global carbon cycle.`,
  },
  {
    id: "corpus_dna",
    title: "Reference notes: DNA structure",
    kind: "corpus",
    text: `Deoxyribonucleic acid carries the hereditary instructions used in the growth and function of living organisms. The molecule is a double helix of two antiparallel strands, each a polymer of nucleotides that pair through hydrogen bonds: adenine with thymine, and guanine with cytosine. The sequence of bases encodes genes, which are transcribed into RNA and, in many cases, translated into proteins. Replication is semiconservative: each strand serves as a template for a new complementary strand, a mechanism that explains how genetic information is copied with high fidelity. Mutations arise when this copying is imperfect or when DNA is damaged by radiation or chemicals. Repair pathways such as nucleotide excision repair and mismatch repair correct many of these errors. In eukaryotes, DNA is packaged with histone proteins into chromatin, and the accessibility of a region of chromatin influences whether the genes it contains are expressed. Comparative sequencing across species has shown that large stretches of DNA are conserved, evidence of shared ancestry and of functional constraint.`,
  },
  {
    id: "corpus_hamlet",
    title: "Reference notes: Hamlet and delay",
    kind: "corpus",
    text: `Hamlet's delay has been read as a moral hesitation, a symptom of melancholy, and a structural device that lets Shakespeare anatomize revenge. The prince is asked to kill Claudius on the word of a ghost whose nature he cannot verify. His first response is not action but a performance of grief and a plan to catch the conscience of the king with a play. Critics who treat the delay as weakness often ignore how thoroughly the court of Elsinore is given to surveillance: every private conversation is at risk of being reported. When Hamlet does strike, he kills the wrong man, and the plot tightens around him. The play therefore withholds a clean heroic killing until the final scene, in which almost every principal figure dies. What looks like indecision is also a refusal to let vengeance pretend it is justice. That refusal is the source of the play's ethical heat, and it is why the soliloquies still feel like thinking rather than ornament.`,
  },
];

export const SAMPLE_PATCHWORK = {
  title: "Energy, algorithms, and a borrowed speech",
  body: `This paper considers three domains that appear unrelated: the physics of a warming planet, the training of statistical models, and a nineteenth-century argument about national purpose. I begin with climate because the observational record is unusually clear.

Earth's climate system is driven by the balance between incoming solar radiation and outgoing infrared radiation. Greenhouse gases including carbon dioxide, methane, and water vapor absorb longwave radiation emitted by the surface and reradiate it, warming the lower atmosphere. Since the late nineteenth century, atmospheric carbon dioxide has risen from about 280 parts per million to more than 420 parts per million, primarily from the combustion of coal, oil, and natural gas. Multiple independent observational records show that the global mean surface temperature has increased by roughly 1.1 degrees Celsius over that period.

A second thread is computational. Machine learning is a family of statistical methods that infer patterns from examples rather than from hand-written rules. In supervised learning, a model is trained on labeled pairs of inputs and outputs so that it can predict the output for unseen inputs. Common supervised tasks include classification, which assigns a discrete label, and regression, which predicts a continuous value. These tools are now used to downscale climate projections, which is one reason the two subjects belong in the same essay.

I close with language that is not mine. Four score and seven years ago our fathers brought forth on this continent, a new nation, conceived in Liberty, and dedicated to the proposition that all men are created equal. Now we are engaged in a great civil war, testing whether that nation, or any nation so conceived and so dedicated, can long endure. The juxtaposition is deliberate: technical description is easy to copy, and civic rhetoric is easy to reuse without saying so.`,
};

export const SAMPLE_ORIGINAL = {
  title: "A kitchen ledger",
  body: `Tuesday I weighed the remaining flour in a chipped bowl because the scale battery died in October and I have not replaced it. The number is a guess dressed as a measurement, which is how most household accounts actually work. My neighbor leaves jars of pickled fennel on the stoop without a note. I leave empty jars in the same place. We have never discussed this.

The bus at 7:12 is quieter than the 7:40, not because fewer people ride it, but because the earlier riders have not yet decided to perform wakefulness. Someone always eats a tangerine and fills the aisle with peel. I used to find that rude. Now I treat it as a seasonal clock. When the peels stop, it is winter, and the windows stay fogged until 34th Street.

I am not trying to extract a thesis from these facts. They are just the week. If a reader wants an argument, here is the only one I trust: attention is a renewable resource only if you spend it on things that can surprise you. Flour, fennel, tangerine. Nothing in that list was on my calendar.`,
};

export const SAMPLE_NEAR_COPY = {
  title: "Hamlet, restated",
  body: `Readers have treated Hamlet's postponement of the killing as a moral pause, as a sign of melancholy, and as a dramatic tool that lets the play study revenge in slow motion. The prince is told to murder Claudius on testimony from a ghost whose status he cannot confirm. Instead of striking, he stages mourning and designs a play to test the king's conscience. Commentators who call this weakness often miss how completely Elsinore runs on watching: no conversation is safe from being carried back. When he finally lunges, he hits the wrong person, and the net around him closes. The tragedy therefore refuses a tidy heroic murder until the last scene, when nearly every major character is dead. Apparent indecision is also a rejection of the idea that vengeance can pass itself off as justice, which is why the speeches still sound like thought.`,
};
