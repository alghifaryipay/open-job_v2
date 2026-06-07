# OpenJob API v2 - Assessment Criteria Checklist

## Criteria 1: RESTful API Document Upload (PDF)

### Reject (0 pts)
- [ ] RESTful API cannot upload PDF files
- [ ] Errors in mandatory Postman tests

### Basic (2 pts)
- [x] RESTful API can upload PDF files
- [x] File size validation (max 5 MB)
- [x] MIME type validation
- [x] Mandatory Postman tests pass without errors

### Skilled (3 pts)
- [x] Meets previous criteria
- [x] Filename stored in database table
- [x] Uses multer library
- [ ] Need to verify implementation

### Advanced (4 pts)
- [x] Meets previous criteria
- [x] RESTful API can display uploaded files
- [ ] All Postman tests pass (mandatory and optional)

**Current Status**: Skilled - Need to verify database storage and file retrieval

---

## Criteria 2: Redis Caching Implementation

### Reject (0 pts)
- [ ] No caching implemented
- [ ] Not using Redis
- [ ] Errors in mandatory tests

### Basic (2 pts)
- [x] Caching on detail endpoint (recommend GET /companies/:id or GET /users/:id)
- [x] Mandatory Postman tests pass
- [ ] Need verification

### Skilled (3 pts)
- [x] Meets previous criteria
- [ ] Cache TTL: 1 hour
- [ ] Redis credentials in environment variables:
  - [ ] REDIS_HOST
  - [ ] REDIS_PORT (implied)
  - [ ] REDIS_PASSWORD (if needed)

### Advanced (4 pts)
- [ ] Meets previous criteria
- [ ] Cache on multiple endpoints
- [ ] Custom header on cache hit: `X-Data-Source: cache`
- [ ] Cache invalidation strategy:
  - [ ] CREATE/UPDATE/DELETE Company → invalidate GET /companies/:id
  - [ ] UPDATE User → invalidate GET /users/:id
  - [ ] CREATE Application → invalidate:
    - [ ] GET /applications/user/:userId
    - [ ] GET /applications/job/:jobId
  - [ ] UPDATE Application → invalidate:
    - [ ] GET /applications/:id
    - [ ] GET /applications/user/:userId
    - [ ] GET /applications/job/:jobId
  - [ ] CREATE/DELETE Bookmark → invalidate:
    - [ ] GET /bookmarks

**Current Status**: Basic - Tests present, need implementation verification

---

## Criteria 3: RabbitMQ Message Queue Implementation

### Reject (0 pts)
- [x] No RabbitMQ implementation (NOT FOUND)
- [ ] Using MQ other than RabbitMQ
- [ ] Errors in mandatory tests

### Basic (2 pts)
- [ ] Send message to RabbitMQ when candidate applies (POST /applications)
- [ ] Message payload contains only: `application_id`
- [ ] Consumer program processes messages asynchronously
- [ ] Mandatory Postman tests pass

### Skilled (3 pts)
- [ ] Meets previous criteria
- [ ] RabbitMQ credentials in environment variables:
  - [ ] RABBITMQ_HOST
  - [ ] RABBITMQ_PORT
  - [ ] RABBITMQ_USER
  - [ ] RABBITMQ_PASSWORD
  - [ ] AMQP_URL (optional, but RABBITMQ_HOST required)

### Advanced (4 pts)
- [ ] Meets previous criteria
- [ ] Consumer sends email notification using Nodemailer
- [ ] Email address retrieved from database (not hardcoded)
- [ ] Email sent to job owner (not applicant)
- [ ] Email contains:
  - [ ] Applicant email
  - [ ] Applicant name
  - [ ] Application date
- [ ] Email credentials in environment variables:
  - [ ] MAIL_HOST
  - [ ] MAIL_PORT
  - [ ] MAIL_USER
  - [ ] MAIL_PASSWORD
- [ ] Only job owner receives notification (authorization check)

**Current Status**: Reject (0 pts) - NOT IMPLEMENTED

---

## Summary

| Criterion | Current | Target | Status |
|-----------|---------|--------|--------|
| 1. PDF Upload | Skilled (3) | Advanced (4) | 75% Complete |
| 2. Redis Caching | Basic (2) | Advanced (4) | 50% Complete |
| 3. RabbitMQ Queue | Reject (0) | Advanced (4) | ❌ Not Started |

**Total Score**: 5/12 = **42%**

**Next Steps**:
1. ✅ Verify PDF storage and retrieval implementation
2. 🔄 Implement cache invalidation strategies
3. ❌ Implement RabbitMQ consumer with email notification
