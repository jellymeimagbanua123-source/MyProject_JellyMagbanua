from django.shortcuts import render, redirect
from django.http import Http404
from django.db import connection


# ── HELPER: run a SELECT and return list of dicts ──────────────────────────
def fetch_all(sql, params=()):
    with connection.cursor() as cursor:
        cursor.execute(sql, params)
        columns = [col[0] for col in cursor.description]
        return [dict(zip(columns, row)) for row in cursor.fetchall()]


def fetch_one(sql, params=()):
    with connection.cursor() as cursor:
        cursor.execute(sql, params)
        columns = [col[0] for col in cursor.description]
        row = cursor.fetchone()
        if row is None:
            return None
        return dict(zip(columns, row))


def execute_sql(sql, params=()):
    with connection.cursor() as cursor:
        cursor.execute(sql, params)


# ── INDEX ───────────────────────────────────────────────────────────────────
def index(request):
    filter_by = request.GET.get('filter', 'all')

    # SELECT tasks based on filter
    if filter_by == 'active':
        tasks = fetch_all(
            "SELECT * FROM todo_task WHERE completed = 0 ORDER BY created_at DESC"
        )
    elif filter_by == 'completed':
        tasks = fetch_all(
            "SELECT * FROM todo_task WHERE completed = 1 ORDER BY created_at DESC"
        )
    else:
        tasks = fetch_all(
            "SELECT * FROM todo_task ORDER BY completed ASC, created_at DESC"
        )

    # SELECT counts
    stats = fetch_one("""
        SELECT
            COUNT(*)                                            AS total,
            SUM(CASE WHEN completed = 0 THEN 1 ELSE 0 END)     AS active,
            SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END)     AS done
        FROM todo_task
    """)

    total     = stats['total']     if stats else 0
    active    = stats['active']    if stats else 0
    completed = stats['done']      if stats else 0

    return render(request, 'todo/index.html', {
        'tasks':     tasks,
        'filter_by': filter_by,
        'total':     total,
        'active':    active,
        'completed': completed,
    })


# ── ADD TASK ────────────────────────────────────────────────────────────────
def add_task(request):
    if request.method == 'POST':
        title       = request.POST.get('title', '').strip()
        description = request.POST.get('description', '').strip()
        priority    = request.POST.get('priority', 'medium')

        if priority not in ('low', 'medium', 'high'):
            priority = 'medium'

        if title:
            execute_sql("""
                INSERT INTO todo_task (title, description, completed, priority, created_at)
                VALUES (%s, %s, 0, %s, CURRENT_TIMESTAMP)
            """, (title, description, priority))

    return redirect('index')


# ── TOGGLE COMPLETE ─────────────────────────────────────────────────────────
def toggle_task(request, task_id):
    task = fetch_one("SELECT * FROM todo_task WHERE id = %s", (task_id,))
    if task is None:
        raise Http404

    new_status = 0 if task['completed'] else 1
    execute_sql(
        "UPDATE todo_task SET completed = %s WHERE id = %s",
        (new_status, task_id)
    )
    return redirect(request.META.get('HTTP_REFERER', '/'))


# ── DELETE TASK ─────────────────────────────────────────────────────────────
def delete_task(request, task_id):
    task = fetch_one("SELECT id FROM todo_task WHERE id = %s", (task_id,))
    if task is None:
        raise Http404

    execute_sql("DELETE FROM todo_task WHERE id = %s", (task_id,))
    return redirect(request.META.get('HTTP_REFERER', '/'))


# ── EDIT TASK ───────────────────────────────────────────────────────────────
def edit_task(request, task_id):
    task = fetch_one("SELECT * FROM todo_task WHERE id = %s", (task_id,))
    if task is None:
        raise Http404

    if request.method == 'POST':
        title       = request.POST.get('title', '').strip()
        description = request.POST.get('description', '').strip()
        priority    = request.POST.get('priority', 'medium')

        if priority not in ('low', 'medium', 'high'):
            priority = 'medium'

        if title:
            execute_sql("""
                UPDATE todo_task
                SET title = %s, description = %s, priority = %s
                WHERE id = %s
            """, (title, description, priority, task_id))

        return redirect('index')

    return render(request, 'todo/edit.html', {'task': task})


# ── CLEAR COMPLETED ─────────────────────────────────────────────────────────
def clear_completed(request):
    execute_sql("DELETE FROM todo_task WHERE completed = 1")
    return redirect('index')
