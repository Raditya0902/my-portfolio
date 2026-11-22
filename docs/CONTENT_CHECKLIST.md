# Content checklist and evidence notes

## Information still needed from Aditya

- [x] Resume: decided not to publish one. Aditya tailors the resume per job description, and a generic copy on the site would go stale. `basics.resumeUrl` stays absent; the hero link renders only if it is set.
- [x] Confirm the permanent production domain: `https://adityarallapalli.com/`. This is the canonical origin used by Astro configuration, page metadata, sitemap, and robots.txt.
- [ ] Confirm current GPA values, degree dates, internship dates, and preferred availability wording before publication. Existing education and dates were retained.
- [ ] Supply links for the previously listed LlamaIndex, LangChain, and ChromaDB contributions. The public merged-PR search during this review returned a GoDFS contribution, which is linked. Unverified specific merged claims are omitted, not treated as disproved.
- [ ] Confirm team size and personal ownership for each project. Do not imply sole authorship where it has not been established.
- [ ] Provide stable public demo URLs or short walkthrough recordings. Localhost, setup instructions, and paid phone services are not public demos.
- [ ] Provide evaluation artifacts for the internship’s previously listed 90.78% pixel accuracy and 92.8% classification accuracy, including split, dataset, and metric definition. The public copy omits these numbers pending context.
- [ ] Confirm the relationship between the 2024 internship and the segmentation repository’s older screenshot dates. Segmentation remains described as project work without a new date claim.

## Featured projects and evidence reviewed

Re-reviewed on 2026-11-22 UTC against each repository's latest default branch. Results are source-reported, not newly executed benchmarks. Every case-study chart uses numbers copied from the artifacts below; update the chart data whenever a repository's results change.

| Project | Evidence | Editorial decision |
| --- | --- | --- |
| lsmdb | README Results section; `benchmarks/results/2026-10-06-p13-compare.json`; `internal/raft` tests | Chart: median throughput with min–max ranges for four engine versions at 1/4/16 clients (GCE e2-standard-4, pd-ssd). The older Apple M4 figures (89.6 ops/s, 296 ms failover) came from the pre-rewrite tool and were removed. No failover result exists for the current engine; no linearizability checker. |
| ShopSphere | README; ExperimentIQ and ModelGuard `reports/analysis_results.json` | Explicitly fictional company and synthetic data. Chart: model vs. recency AUC on reference (0.733 vs. 0.559) and out-of-time (0.740 vs. 0.565) windows. Conversion relative lift 0.0688, p=0.036; revenue p=0.373 is not significant. |
| vLLM harness | README; `reports/README.md` | Chart: output throughput vs. concurrency for fp16, AWQ, GPTQ, and the serial baseline on RTX A5000. Explain the serial baseline and memory tradeoff. |
| Mini Feature Store | README (2026-11-18 verification update); `internal/historical` | Diagram of the as-of join rule (newest snapshot at or before the event, 24-hour TTL). Joins now scan Parquet in batches; do not turn the Spark materialization timing into a claim about joins or serving. |
| PEFT comparison | README (2026-11-19); `results/phase1-v1/references-v100/report_tables_answer_first.md`; `report/phase0_audit.md` | The original report is superseded. Chart: same-pipeline accuracy with 95% bootstrap intervals. Zero-shot 0.7422 is highest but not distinguishable from five-shot or 2-epoch IA3 (0.7210). Latency, overfitting, and category claims are withdrawn. |
| RAG RBAC | README Evaluation section; `EVAL_RESULTS.md` (2026-11-22 entry) | Chart: faithfulness and relevancy by question type. Current: faithfulness 0.9490, relevancy 0.8831 on 40 answerable questions, 10/10 refusals, deepseek-chat judge. Earlier scores used other judges, models, or question sets and are not comparable. |

The directory’s additional project summaries are grounded in their public READMEs. Diffuse Refactor is described as a limited benchmark study, without its original claim of general proof. Graph Analytics is described as an educational ETL/graph project, without asserting real-time streaming or Kafka usage.

## Strongest next additions

1. Linked evidence for open-source contributions.
2. Short, accessible demo recordings for the database failover, inference dashboard, and AI applications.
3. Clear ownership, dates, and reproducibility instructions for each featured project.
4. Additional experimental repetitions and confidence intervals where applicable. Keep existing negative results and limitations visible.
5. Real deployment or user-impact evidence, when available. Do not relabel simulations as production outcomes.
