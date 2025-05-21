# 🎓 CampusTrade

**CampusTrade** is a web application that allows university students to buy, sell, and trade secondhand items within their campus community. Built with a modern web stack and deployed using Docker and Kubernetes on Google Cloud.

🌐 **Live Demo:** [https://campustradex.vercel.app/](https://campustradex.vercel.app/)  
_Deployed via Vercel for quick public access._

---

## 🚀 Features

- 🛒 List and browse used items
- 🔍 Search and filter functionality
- 📦 Item detail views
- 👤 User authentication (if implemented)
- ☁️ Containerized with Docker
- ⚙️ Deployed using Kubernetes (GKE)
- 🌐 Publicly accessible via LoadBalancer service

---

## 🧰 Tech Stack

| Layer           | Technology                        |
|----------------|------------------------------------|
| Frontend       | Next.js                            |
| Backend        | Node.js                            |
| Database       | Firebase                           |
| Containerization| Docker                            |
| Orchestration  | Kubernetes (Google Kubernetes Engine) |
| Image Registry | Docker Hub                         |
| Cloud Provider | Google Cloud Platform (GCP)        |


## ☁️ Deployment Overview
### 1. Docker Image pushed to Docker Hub:
```docker.io/s223399201/campustrade:latest```

### 2. Kubernetes YAML Files:

```deployment.yaml``` defines the Deployment and LoadBalancer Service.

### 3. Cluster:
   - Created on GKE (Google Kubernetes Engine)
   - Autoscaling and auto-repair enabled

### 4. Access:
   - External IP via LoadBalancer Service

## 🏠 Landing Page

![image](https://github.com/user-attachments/assets/798451a1-93c6-438a-b727-048f9a163588)

## 📝 Author
Oris (s223399201)

Built as part of SIT323 – Cloud Native Application Development

Deakin University – Trimester 1, 2025

